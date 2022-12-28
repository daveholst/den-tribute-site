import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { crawlDirectory } from './utils';
import path from 'path';
import * as mime from 'mime';

// This is the path to the other project relative to the CWD
const staticFiles = '../build';
const name = 'den-tribute';
const domain = 'wintonpark.com.au';
const tenMinutes = 60 * 10;
const certArn = 'arn:aws:acm:us-east-1:739766728346:certificate/f8e2730f-03b3-4e9d-9aa0-78ca4cd8798f';

/**
 * Domain & Certs
 */

// Get the hosted zone by domain name
const selectedZone = aws.route53.getZone({ name: domain + '.' });

/**
 * Static Assets Bucket
 */

// Create an s3 bucket
const staticFilesBucket = new aws.s3.Bucket(`${name}-static-files-bucket`, {
	bucket: domain,
	acl: 'public-read'
});

// Place files from static into bucket
const webContentsRootPath = path.join(process.cwd(), staticFiles);

crawlDirectory(webContentsRootPath, (filePath: string) => {
	const relativeFilePath = filePath.replace(webContentsRootPath + '/', '');
	new aws.s3.BucketObject(
		relativeFilePath,
		{
			key: relativeFilePath,

			acl: 'public-read',
			bucket: staticFilesBucket,
			contentType: mime.getType(filePath) || undefined,
			source: new pulumi.asset.FileAsset(filePath)
		},
		{
			parent: staticFilesBucket
		}
	);
});

/**
 * CDN
 */

// distributionArgs configures the CloudFront distribution. Relevant documentation:
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html
// https://www.terraform.io/docs/providers/aws/r/cloudfront_distribution.html

// Cloudfront Distribution config
const distributionArgs: aws.cloudfront.DistributionArgs = {
	enabled: true,
	aliases: [domain],
	defaultRootObject: 'index.html',
	origins: [
		{
			originId: 'static-bucket',
			domainName: staticFilesBucket.bucketDomainName,
			customOriginConfig: {
				// Amazon S3 doesn't support HTTPS connections when using an S3 bucket
				originProtocolPolicy: 'http-only',
				httpPort: 80,
				httpsPort: 443,
				originSslProtocols: ['TLSv1.2']
			}
		}
	],
	defaultCacheBehavior: {
		targetOriginId: 'static-bucket',
		viewerProtocolPolicy: 'redirect-to-https',
		allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
		cachedMethods: ['GET', 'HEAD', 'OPTIONS'],

		forwardedValues: {
			cookies: { forward: 'all' },
			queryString: true,
			headers: ['Origin']
		},

		minTtl: 5,
		defaultTtl: tenMinutes,
		// defaultTtl: 15,
		maxTtl: tenMinutes
		// maxTtl: 15
	},
	customErrorResponses: [
		{
			errorCode: 404,
			responseCode: 200,
			responsePagePath: '/index.html'
		}
	],

	// "All" is the most broad distribution, and also the most expensive.
	priceClass: 'PriceClass_All',

	restrictions: {
		geoRestriction: {
			restrictionType: 'none'
		}
	},

	viewerCertificate: {
		acmCertificateArn: certArn, // Per AWS, ACM certificate must be in the us-east-1 region.
		sslSupportMethod: 'sni-only'
	}
};

// Create CloudFront Distribution from config
const cdn = new aws.cloudfront.Distribution(`${name}-cdn`, distributionArgs);

/**
 * DNS
 */

//  Create DNS record for cloudfront
const dnsRecord = new aws.route53.Record(
	`${name}-dns-record`,
	{
		name: domain,
		type: 'A',
		zoneId: selectedZone.then((sz) => sz.zoneId),
		aliases: [
			{
				evaluateTargetHealth: false,
				name: cdn.domainName,
				zoneId: cdn.hostedZoneId
			}
		]
	},
	{ dependsOn: [cdn] }
);

exports.cdnLink = cdn.domainName;
exports.dnsRecord = dnsRecord.name;

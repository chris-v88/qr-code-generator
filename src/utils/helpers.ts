export const sanitizeUrl = (url: string): string => {
  let decodedUrl: string;
  try {
    decodedUrl = decodeURIComponent(url);
  } catch (error) {
    console.error('Failed to decode URL', { url, error });
    decodedUrl = url;
  }

  try {
    const harmfulPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:[^&\s]*/gi,
      /vbscript:[^&\s]*/gi,
      /data:text\/html[^&\s]*/gi,
      /data:text\/javascript[^&\s]*/gi,
      /on\w+=["']?[^"'\s&]*/gi,
      /document\.cookie[^;&]*/gi,
      /window\.location[^;&]*/gi,
      /localStorage[^;&]*/gi,
      /sessionStorage[^;&]*/gi,
      /alert\([^)]*\)/gi,
      /eval\([^)]*\)/gi,
      /confirm\([^)]*\)/gi,
      /prompt\([^)]*\)/gi,
    ];

    let sanitizedUrl = decodedUrl;
    harmfulPatterns.forEach((pattern) => {
      const regex =
        pattern instanceof RegExp ? pattern : new RegExp(pattern, 'gi');
      sanitizedUrl = sanitizedUrl.replace(regex, '');
    });

    // if we removed more than 20% of the URL, consider it harmful
    if (sanitizedUrl.length < decodedUrl.length * 0.8) {
      console.error('URL contains harmful content', url);
    }
    return encodeURI(sanitizedUrl);
  } catch (e: any) {
    return ''; // Invalid URL after sanitization
  }
};

import * as redirectService from '../services/redirect.service.js';

const handleRedirect = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const originalUrl = await redirectService.processRedirect(shortCode, req);
    
    // Redirect with 302 Found (or 301 Moved Permanently if preferred, but 302 is better for analytics tracking)
    return res.redirect(302, originalUrl);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    // In a real production app, we would redirect to a specific custom 404/Error page on the frontend.
    // For now, we'll send JSON or plain text.
    return res.status(statusCode).send(error.message || 'Internal server error');
  }
};

export {
  handleRedirect
};

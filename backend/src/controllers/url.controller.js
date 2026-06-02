import * as urlService from '../services/url.service.js';
import { createUrlSchema, updateUrlSchema, bulkCreateUrlSchema } from '../validators/url.validator.js';

const createUrl = async (req, res) => {
  try {
    const { error, value } = createUrlSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { originalUrl, customAlias, expiryDate } = value;
    const url = await urlService.createUrl(req.user.id, originalUrl, customAlias, expiryDate);

    return res.status(201).json(url);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

const bulkCreateUrls = async (req, res) => {
  try {
    const { error, value } = bulkCreateUrlSchema.validate(req.body.urls);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const results = await urlService.bulkCreateUrls(req.user.id, value);
    return res.status(207).json(results); // 207 Multi-Status
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

const getUrls = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';

    const result = await urlService.getUserUrls(req.user.id, page, limit, search);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getUrlById = async (req, res) => {
  try {
    const url = await urlService.getUrlById(req.user.id, req.params.id);
    return res.status(200).json(url);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

const updateUrl = async (req, res) => {
  try {
    const { error, value } = updateUrlSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const url = await urlService.updateUrl(req.user.id, req.params.id, value);
    return res.status(200).json(url);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

const deleteUrl = async (req, res) => {
  try {
    await urlService.deleteUrl(req.user.id, req.params.id);
    return res.status(200).json({ message: 'URL deleted successfully' });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
};

export {
  createUrl,
  bulkCreateUrls,
  getUrls,
  getUrlById,
  updateUrl,
  deleteUrl
};

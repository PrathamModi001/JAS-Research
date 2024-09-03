import { body } from 'express-validator';

export const researchPaperValidator = function (method) {
  switch (method) {
    case 'createResearchPaper': {
      return [
        body('title', 'Title is required').notEmpty(),
        body('synopsis', 'Synopsis is required').notEmpty(),
        body('keywords', 'Keywords must be an array').isArray(),
        body('authors', 'Authors must be an array').isArray().notEmpty(),
        body('contactNumber', 'Contact number is required').notEmpty(),
        body('yearOfPublication', 'Year of publication is required').notEmpty(),
        body('language', 'Language is required').notEmpty(),
        body('officialUrl', 'File Upload on any site on'),
        body('issn', 'ISSN number').optional().isArray(),
        body('journalName', 'journal name is string').optional().isArray(),
        body('mainCategories', 'Main category must be an array')
          .isArray()
          .notEmpty(),
        body('subCategories', 'Sub categories must be an array')
          .optional()
          .isArray(),
      ];
    }
    case 'updateResearchPaper': {
      return [
        body('title', 'Title is required').optional().notEmpty(),
        body('synopsis', 'Synopsis is required').optional().notEmpty(),
        body('keywords', 'Keywords must be an array').optional().isArray(),
        body('authors', 'Authors must be an array')
          .optional()
          .isArray()
          .notEmpty(),
        body('contactNumber', 'Contact number is required')
          .optional()
          .notEmpty(),
        body('yearOfPublication', 'Year of publication is required')
          .optional()
          .notEmpty(),
        body('language', 'Language is required').optional().notEmpty(),
        body('mainCategories', 'Main category must be an array')
          .optional()
          .isArray()
          .notEmpty(),
        body('subCategories', 'Sub categories must be an array')
          .optional()
          .isArray(),
        body('isApproved', 'isApproved ').optional(),
        body('files', 'Files must be an array').optional().isArray(),
      ];
    }
  }
};

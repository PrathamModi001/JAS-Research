import express from 'express';
import { researchPaperValidator } from '../validators/researchPaperValidator.js';
import {
  AdminAuthenticationCheck,
  userAndAdminAuthenticationCheck,
  userAndAdminAuthenticationCheckCreateResearchPaper,
} from '../config/authenticate.js';
import { researchPaperController } from '../controllers/researchPaperController.js';
// import multer from 'multer';

export const researchPaperRouter = express.Router();

// const upload = multer({
//   limits: {
//     fileSize: 125 * 1024 * 1024, // Set the maximum file size (25MB)
//   //   files: 5, // Set the maximum number of files (5)
//   }
// });
/**
 * @swagger
 * /research-paper:
 *   post:
 *     tags:
 *      - ResearchPaper
 *     summary: Create a research paper entry.
 *     description: |
 *       Use this endpoint to create a new research paper entry.
 *       
 *       Here is the cURL command for reference:
 *       ```bash
 *       curl --location 'http://localhost:8000/research-paper/' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *         "doi": "edsdhj1",
 *         "title": "Sample Research Paper 120",
 *         "synopsis": "This is a sample synopsis for the research paper.",
 *         "keywords": ["keyword1", "keyword2"],
 *         "authors": ["Author 1", "Author 2"],
 *         "contactNumber": "839999995",
 *         "yearOfPublication": "2024",
 *         "language": "English",
 *         "mainCategories": ["Category 1"],
 *         "subCategories": ["Subcategory 1", "Subcategory 2"],
 *         "files": ["913a32af-c037-4845-8a75-730059f0e614"],
 *         "journalName": ["Text123"],
 *         "issn": ["ABC"],
 *         "email": "hello@gmail.com"
 *       }'
 *       ```
 * 
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doi:
 *                 type: string
 *                 example: "edsdhj1"
 *               title:
 *                 type: string
 *                 example: "Sample Research Paper 120"
 *               synopsis:
 *                 type: string
 *                 example: "This is a sample synopsis for the research paper."
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["keyword1", "keyword2"]
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Author 1", "Author 2"]
 *               contactNumber:
 *                 type: string
 *                 example: "839999995"
 *               yearOfPublication:
 *                 type: string
 *                 example: "2024"
 *               language:
 *                 type: string
 *                 example: "English"
 *               mainCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Category 1"]
 *               subCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Subcategory 1", "Subcategory 2"]
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["913a32af-c037-4845-8a75-730059f0e614"]
 *               journalName:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Text123"]
 *               issn:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["ABC"]
 *               email:
 *                 type: string
 *                 example: "hello@gmail.com"
 *     responses:
 *       201:
 *         description: Research paper created successfully.
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */


researchPaperRouter.post(
  '/',
  userAndAdminAuthenticationCheckCreateResearchPaper,
  // upload.array('files'),
  researchPaperValidator('createResearchPaper'),
  researchPaperController.createResearchPaper
);

researchPaperRouter.post(
  '/pre-signed',
  userAndAdminAuthenticationCheckCreateResearchPaper,
  // upload.array('files'),
  researchPaperController.getPresignedUrl
)

/**
 * @swagger
 * /research-paper/{id}:
 *   put:
 *     tags:
 *       - ResearchPaper
 *     summary: Update a research paper.
 *     description: Update an existing research paper entry.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the research paper to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the research paper.
 *               synopsis:
 *                 type: string
 *                 description: Synopsis of the research paper.
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Keywords associated with the research paper.
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Authors of the research paper.
 *               contactNumber:
 *                 type: string
 *                 description: Contact number associated with the research paper.
 *               yearOfPublication:
 *                 type: string
 *                 description: Year of publication of the research paper.
 *               language:
 *                 type: string
 *                 description: Language of the research paper.
 *               mainCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Main categories of the research paper.
 *               subCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Subcategories of the research paper.
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Locations of files associated with the research paper.
 *               isApproved:
 *                 type: string
 *                 description: Approval status of the research paper.
 *     responses:
 *       200:
 *         description: Research paper updated successfully.
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */

researchPaperRouter.put(
  '/:id',
  userAndAdminAuthenticationCheckCreateResearchPaper,
  // upload.array('files'),
  researchPaperValidator('updateResearchPaper'),
  researchPaperController.updateResearchPaper
);

/**
 * @swagger
 * /research-paper/file/{uuid}:
 *   put:
 *     tags:
 *       - ResearchPaper
 *     summary: Update a research paper file.
 *     description: Update an existing research paper file.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the research paper to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Locations of files associated with the research paper.
 *     responses:
 *       200:
 *         description: Research paper file updated successfully.
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */

researchPaperRouter.put(
  '/file/:uuid',
  AdminAuthenticationCheck,
  // upload.array('files'),
  researchPaperController.updateResearchPaperFile
);

/**
 * @swagger
 * /research-paper/file/{id}:
 *   delete:
 *     tags:
 *       - ResearchPaper
 *     summary: Delete a research paper file.
 *     description: Delete an existing research paper file.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the research paper file to delete.
 *     responses:
 *       200:
 *         description: Research paper file deleted successfully.
 *       400:
 *         description: Bad request. Invalid input.
 *       404:
 *         description: Research paper file not found.
 */


researchPaperRouter.delete(
  '/file/:id',
  AdminAuthenticationCheck,
  researchPaperController.deleteResearchPaper
);




/**
 * @swagger
 * /research-paper/details:
 *   get:
 *     tags:
 *     - ResearchPaper
 *     summary: Get details for research paper metadata.
 *     description: Retrieve a list of distinct authors and years of publication from the research papers.
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of research paper metadata retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of distinct authors from the research papers.
 *                 yearOfPublication:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of distinct years of publication from the research papers.
 *       400:
 *         description: Bad request. Invalid input.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */
researchPaperRouter.get(
  '/details',
  userAndAdminAuthenticationCheck,
  researchPaperController.detailsList
);

/**
 * @swagger
 * /research-paper/{id}:
 *   get:
 *     tags:
 *       - ResearchPaper
 *     summary: Get a research paper by ID.
 *     description: Retrieve details of a research paper by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the research paper to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the research paper.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Title of the research paper.
 *                 synopsis:
 *                   type: string
 *                   description: Synopsis of the research paper.
 *                 keywords:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Keywords associated with the research paper.
 *                 authors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Authors of the research paper.
 *                 contactNumber:
 *                   type: string
 *                   description: Contact number associated with the research paper.
 *                 yearOfPublication:
 *                   type: string
 *                   description: Year of publication of the research paper.
 *                 language:
 *                   type: string
 *                   description: Language of the research paper.
 *                 mainCategories:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Main categories of the research paper.
 *                 subCategories:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Subcategories of the research paper.
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Locations of files associated with the research paper.
 *                 isApproved:
 *                   type: boolean
 *                   description: Approval status of the research paper.
 *       404:
 *         description: Research paper not found.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */
researchPaperRouter.get(
  '/:id',
  userAndAdminAuthenticationCheck,
  researchPaperController.getResearchPaperById
);

/**
 * @swagger
 * /research-paper:
 *   get:
 *     tags:
 *      - ResearchPaper
 *     summary: Get a list of research papers.
 *     description: Retrieve a list of research papers.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isApproved
 *         schema:
 *           type: boolean
 *         description: Flag to filter approved or unapproved research papers. Set to 'true' to retrieve approved papers.
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *       - in: query
 *         name: yearOfPublication
 *         schema:
 *           type: string
 *       - in: query
 *         name: authors
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *       - in: query
 *         name: mainCategories
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: subCategories
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: pageNo
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The page number for pagination. Default is 1.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           description: The maximum number of items to return per page. Default is 10.
 *         description: A search query to filter research papers based on author name, title, type, or category.
 *     responses:
 *       200:
 *         description: List of research papers retrieved successfully.
 *       400:
 *         description: Bad request. Invalid input.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */

researchPaperRouter.get(
  '/',
  userAndAdminAuthenticationCheck,
  researchPaperController.getResearchPaperList
);

/**
 * @swagger
 * /research-paper:
 *   delete:
 *     tags:
 *       - ResearchPaper
 *     summary: Delete a research paper.
 *     description: Delete an existing research paper entry.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fileuuid
 *         type: string
 *         required: true
 *         description: UUID of the research paper to delete.
 *     responses:
 *       200:
 *         description: Research paper deleted successfully.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       404:
 *         description: Research paper not found.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */
researchPaperRouter.delete(
  '/',
  AdminAuthenticationCheck,
  researchPaperController.deleteResearchPaperFile
);


/** 
 * @swagger
 * /research-paper/download/{uuid}:
 *   get:
 *     tags:
 *       - ResearchPaper
 *     summary: Download a research paper by UUID.
 *     description: Download a research paper by its UUID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         type: string
 *         required: true
 *         description: UUID of the research paper to download.
 *     responses:
 *       200:
 *         description: Research paper downloaded successfully.
 *       404:
 *         description: Research paper not found.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */
researchPaperRouter.get(
  '/download/:uuid',
  userAndAdminAuthenticationCheck,
  researchPaperController.downloadResearchPaper
);
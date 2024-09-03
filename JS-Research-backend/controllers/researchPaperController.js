import { validationResult } from 'express-validator';
import ResearchPaper from '../models/ResearchPaper.js';
import {
  deleteS3Object,
  handleFileUpload,
  getFile,
  getUploadUrl,
} from '../utils/awsUtils.js';
import { userRoles } from '../utils/helper.js';
// import { v4 as uuidv4 } from 'uuid';
import { researchPaperCreated, researchPaperEdit, researchPaperApproved } from '../utils/mailutils.js';
import User from '../models/User.js';
import { rejection } from '../utils/mailutils.js';
// import path from 'path';

// const availableExtensions = ['.pdf', '.doc', '.docx'];

export const researchPaperController = {
  createResearchPaper: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ status: false, message: errors.array()[0].msg });
        }

        // Extract data from request body
        const {
          doi,
          title,
          synopsis,
          keywords,
          authors,
          journalName,
          issn,
          files,
          contactNumber,
          yearOfPublication,
          language,
          mainCategories,
          subCategories,
          officialUrl,
          email,
          itemType,
          isbn,
        } = req.body;

        let isApproved = 'pending';

        // Determine approval status based on user role
        if (req?.user) {
          isApproved =
            req.user.role === userRoles.Admin ? 'approved' : 'pending';
        }

        // Check if files were uploaded and validate the number of files
        // const filesArray = req.files;
        // if (!filesArray || filesArray.length === 0) {
        //   return res
        //     .status(400)
        //     .json({ status: false, message: 'No files uploaded' });
        // }
        // // for each loop to check each file in files
        // filesArray?.forEach((file) => {
        //   const extension = path.extname(file.originalname);
        //   if (!availableExtensions.includes(extension)) {
        //     return res
        //       .status(400)
        //       .json({
        //         status: false,
        //         message: 'Only pdf, doc and docx files are allowed',
        //       });
        //   }
        // });
        // if (filesArray?.length > 5) {
        //   return res
        //     .status(400)
        //     .json({
        //       status: false,
        //       message: 'Only 5 files are acceptable.'
        //     });
        // }

        // // Upload files to S3 and get file locations
        // const files = [];

        // filesArray?.forEach((file) => {
        //   const uuid = uuidv4();
        //   handleFileUpload(file, uuid);
        //   files.push(uuid);
        // });

        // Create a new research paper instance
        const newResearchPaper = new ResearchPaper({
          doi,
          title,
          synopsis,
          keywords,
          authors,
          contactNumber,
          yearOfPublication,
          language,
          mainCategories,
          subCategories,
          email,
          isApproved: isApproved,
          officialUrl,
          files,
          issn,
          journalName,
          itemType,
          isbn,
        });
        if (req.user && req.user.role !== userRoles.Admin) {
          // send email to every user that has a role of admin
          const adminEmails = await User.find({ role: userRoles.Admin });
          adminEmails.forEach((admin) => {
            researchPaperCreated(admin.email, admin.firstName);
          });
          if (!adminEmails) {
            return res
              .status(400)
              .json({ status: false, message: 'No admin found' });
          }
          const loggedInUserEmail = await researchPaperCreated(
            req.user.email,
            req.user.firstName
          );
          if (!loggedInUserEmail) {
            return res
              .status(400)
              .json({ status: false, message: 'Email not sent' });
          }
        }
        // Anonymous creation of research paper
        if (!req.user) {
          const adminEmails = await User.find({ role: userRoles.Admin });
          adminEmails.forEach((admin) => {
            researchPaperCreated(admin.email, admin.firstName);
          });
          if (!adminEmails) {
            return res
              .status(400)
              .json({ status: false, message: 'No admin found' });
          }
        }

        // key person send mail
        const keyPersonEmail = await researchPaperCreated(email, '');
        if (!keyPersonEmail) {
          return res
            .status(400)
            .json({ status: false, message: 'Email not sent' });
        }

        // Save the new research paper
        const savedResearchPaper = await newResearchPaper.save();
        //await pendingResearchPaper();
        // Return success response
        return res.status(200).json({
          status: true,
          message: 'Research paper created successfully',
          data: savedResearchPaper,
        });
      } catch (err) {
        return res.status(400).json({ status: false, message: err.message });
      }
    },
  ],
  getPresignedUrl: [
    async (req, res) => {
      try {
        const { fileName, fileCategory } = { fileName: 'example.pdf', fileCategory: 'PDF' };
        const uploadData = await getUploadUrl(fileName, fileCategory);
        if (!uploadData) {
          return res
            .status(400)
            .json({ status: false, message: 'Error uploading file' });
        }
        return res.status(200).json({
          status: true,
          message: 'Presigned URL generated successfully',
          data: uploadData,
        });
      } catch (err) {
        return res.status(400).json({ status: false, message: err.message });
      }
    },
  ],
  updateResearchPaper: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ status: false, message: errors.array()[0].msg });
        }
        if ((!req.user || req.user.role === userRoles.User) && req.body.isApproved) {
          return res
            .status(400)
            .json({ status: false, message: 'You are not allowed to approve or disapprove' });
        }

        const paperId = req.params.id;
        const updates = req.body;
        // const filesArray = req.files;
        // const files = [];
        const paper = await ResearchPaper.findById(paperId);

        // Check if only files have been updated
        const updateKeys = Object.keys(updates);
        if (updateKeys.length === 1 && updateKeys.includes('files')) {
          return res
            .status(200)
            .json({ status: true, message: 'File Uploaded Successfully!' });
        }

        if (!paper) {
          return res
            .status(404)
            .json({ status: false, message: 'Paper not found' });
        }

        // if (filesArray?.length > 0) {
        // filesArray.forEach((file) => {
        //   const uuid = uuidv4();
        //   handleFileUpload(file, uuid);
        //   files.push(uuid);
        // });

        // If there are new files, merge them with the existing files
        // if (paper) {
        //   updates.files = [...paper.files, ...files];
        // } else {
        //   return res
        //     .status(404)
        //     .json({ status: false, message: 'Paper not found' });
        // }
        const approvedNow = (req.body.isApproved === 'approved' && paper.isApproved === 'disapproved' || req.body.isApproved === 'approved' && paper.isApproved === 'pending');

        const disapprovedNow = (req.body.isApproved === 'disapproved' && paper.isApproved === 'approved' || req.body.isApproved === 'disapproved' && paper.isApproved === 'pending');
        if (approvedNow) {
          const emailSentToKeyPerson = await researchPaperApproved(
            paper.email,
            paper.title
          );
          if (!emailSentToKeyPerson) {
            return res
              .status(404)
              .json({ status: false, message: 'Email not sent' });
          }
        }
        if (disapprovedNow) {
          // const emailSentToLoggedInUser = await rejection(
          //   req.user.email,
          //   paper.title,
          //   paper.reasonOfRejection
          // );
          const emailSentToKeyPerson = await rejection(
            paper.email,
            paper.title,
            req.body.reasonOfRejection
          );
          if (!emailSentToKeyPerson) {
            return res
              .status(404)
              .json({ status: false, message: 'Email not sent' });
          }
        }

        await ResearchPaper.findOneAndUpdate(
          { _id: paperId },
          updates,
          { new: true }
        );

        if (!req.body.reasonOfRejection && !approvedNow && !disapprovedNow) {
          const emailSentToKeyPerson = await researchPaperEdit(
            paper.email,
            paper.title
          );
          if (!emailSentToKeyPerson) {
            return res
              .status(404)
              .json({ status: false, message: 'Email not sent' });
          }
        }

        if (req?.user?.email && !req.body.reasonOfRejection && (req?.user?.role !== userRoles.Admin)) {
          const emailSentToLoggedInUser = await researchPaperEdit(
            req?.user?.email,
            paper.title
          );
          if (!emailSentToLoggedInUser) {
            return res
              .status(404)
              .json({ status: false, message: 'Email not sent' });
          }
        }
        let message;
        if (paper?.isApproved === 'approved') {
          message = 'Paper approved successfully';
        } else if (paper?.isApproved === 'disapproved') {
          message = 'Paper disapproved successfully';
        } else {
          message = 'Paper updated successfully';
        }

        return res.status(200).json({
          status: true,
          message: message,
          paper: paper,
        });
      } catch (err) {
        return res.status(400).json({ status: false, message: err.message });
      }
    },
  ],
  updateResearchPaperFile: [
    async (req, res) => {
      try {
        const updates = req.body;
        if (!updates) {
          return res
            .status(400)
            .json({ status: false, message: 'No updates provided' });
        }

        const fileUuid = req.params.uuid;
        if (!fileUuid) {
          return res
            .status(400)
            .json({ status: false, message: 'File not found' });
        }

        const filesArray = req.files;
        const files = [];

        filesArray?.forEach((file) => {
          const uuid = fileUuid;
          handleFileUpload(file, uuid);
          files.push(uuid);
        });

        if (files.length > 0) {
          updates.files = files;
        }

        return res.status(200).json({
          status: true,
          message: 'File updated successfully',
          file: fileUuid,
        });
      } catch (err) {
        return res.status(400).json({ status: false, message: err.message });
      }
    },
  ],

  getResearchPaperList: [
    async (req, res) => {
      try {
        const {
          isApproved = 'approved',
          pageNo = 1,
          limit = 10,
          query: queryfilter = '',
          authors,
          yearOfPublication,
          mainCategories,
          subCategories,
          language = '',
          itemType = '',
        } = req.query;

        const filterQuery = {
          deletedAt: null, // Only include documents that are not soft deleted
          $or: [
            { authors: { $regex: new RegExp(queryfilter, 'i') } },
            { title: { $regex: new RegExp(queryfilter, 'i') } },
            { keywords: { $regex: new RegExp(queryfilter, 'i') } },
          ],
        };

        if (authors && typeof authors === 'string') {
          filterQuery.authors = { $regex: authors, $options: 'i' };
        }
        if (yearOfPublication && typeof yearOfPublication === 'string') {
          filterQuery.yearOfPublication = {
            $regex: yearOfPublication,
            $options: 'i',
          };
        }

        if (yearOfPublication) {
          if (Array.isArray(yearOfPublication)) {
            // If yearOfPublication is an array, use the $in operator
            filterQuery.yearOfPublication = { $in: yearOfPublication };
          } else if (typeof yearOfPublication === 'string') {
            // If yearOfPublication is a single string, use regex
            filterQuery.yearOfPublication = {
              $regex: yearOfPublication,
              $options: 'i',
            };
          }
        }

        if (authors) {
          if (Array.isArray(authors)) {
            // If authors is an array, use the $in operator
            filterQuery.authors = {
              $in: authors.map((author) => new RegExp(author, 'i')),
            };
          } else if (typeof authors === 'string') {
            // If authors is a single string, use regex
            filterQuery.authors = { $regex: authors, $options: 'i' };
          }
        }

        if (mainCategories && typeof mainCategories === 'string') {
          filterQuery.mainCategories = {
            $regex: mainCategories,
            $options: 'i',
          };
        }
        if (subCategories && typeof subCategories === 'string') {
          filterQuery.subCategories = { $regex: subCategories, $options: 'i' };
        }
        if (isApproved !== undefined) {
          filterQuery.isApproved = isApproved;
        }
        if (language && typeof language === 'string') {
          filterQuery.language = { $regex: language, $options: 'i' };
        }
        if (itemType && typeof itemType === 'string') {
          filterQuery.itemType = { $regex: itemType, $options: 'i' };
        }

        const count = await ResearchPaper.countDocuments(filterQuery);
        const researchPaper = await ResearchPaper.find(filterQuery)
          .select('-uuid -updatedAt -createdAt') // Excluding sensitive fields
          .sort({ updatedAt: -1 }) // Sorting by latest edited or added time
          .skip((pageNo - 1) * limit)
          .limit(limit);

        return res.status(200).json({
          status: true,
          data: {
            list: researchPaper,
            total: count,
            next: count > (pageNo - 1) * limit + researchPaper.length,
          },
        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  deleteResearchPaperFile: [
    async (req, res) => {
      try {
        const fileuuid = req.query.fileuuid;
        const path = `${process.env.BUCKET_FOLDER}/${fileuuid}`;

        const deletedObjects = await deleteS3Object(path);
        const deleteFilepath = await ResearchPaper.updateOne(
          { files: fileuuid }, // Filter to ensure we only update documents where files contain fileuuid
          { $pull: { files: fileuuid } }
        );
        if (deletedObjects?.length === 0 || deleteFilepath?.nModified === 0) {
          return res.status(404).json({
            status: false,
            message: 'File not found or file reference not updated',
          });
        }
        return res.status(200).json({
          status: true,
          message: 'Paper delete successfully',
        });
      } catch (err) {
        return res.status(400).json({ status: false, message: err.message });
      }
    },
  ],

  deleteResearchPaper: [
    async (req, res) => {
      try {
        const paperId = req.params.id;
        const paper = await ResearchPaper.findById(paperId);
        if (!paper) {
          return res.status(404).json({ status: false, message: 'Paper not found' });
        }

        // Delete files from S3
        const deleteFilePromises = paper.files.map(async (fileuuid) => {
          const path = `${process.env.BUCKET_FOLDER}/${fileuuid}`;
          return deleteS3Object(path);
        });

        const deleteResults = await Promise.all(deleteFilePromises);

        // Check if any file deletion failed
        const failedDeletions = deleteResults.filter(result => result.message !== 'Objects deleted successfully');
        if (failedDeletions.length > 0) {
          return res.status(500).json({
            status: false,
            message: 'Failed to delete some files from S3',
          });
        }

        // Delete the research paper from the database
        await ResearchPaper.findByIdAndUpdate(paperId, { deletedAt: new Date() });

        return res.status(200).json({
          status: true,
          message: 'Paper and associated files deleted permanently',
        });
      } catch (err) {
        console.error('Error deleting research paper:', err);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
      }
    },
  ],


  detailsList: [
    async (req, res) => {
      try {
        // only include documents that are not soft deleted
        const isApprovedData = req.user.role === userRoles.User && 'approved';

        const filter = isApprovedData
          ? { deletedAt: null, isApproved: isApprovedData }
          : { deletedAt: null };

        // Retrieve distinct authors and years of publication for documents not soft deleted
        const authorsData =
          await ResearchPaper.find(filter).distinct('authors');
        const yearsData =
          await ResearchPaper.find(filter).distinct('yearOfPublication');

        const data = {
          authors: authorsData,
          yearOfPublication: yearsData,
        };

        return res.status(200).json({ status: true, data: data });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: 'An error occurred while fetching the data.',
        });
      }
    },
  ],
  getResearchPaperById: [
    async (req, res) => {
      try {
        const paperId = req.params.id;
        const paper = await ResearchPaper.findOne({
          _id: paperId,
          deletedAt: null,
        });

        if (!paper) {
          return res
            .status(404)
            .json({ status: false, message: 'Paper not found' });
        }

        return res.status(200).json({
          status: true,
          message: 'Paper fetched successfully',
          paper: paper,
        });
      } catch (err) {
        return res.status(400).json({ status: false, message: err.message });
      }
    },
  ],
  downloadResearchPaper: [
    async (req, res) => {
      try {
        const fileKey = req.params.uuid;

        // Assuming paper.files is an array of file keys and you want to get the first file
        // const fileKey = paper.files[0];
        if (!fileKey) {
          return res
            .status(404)
            .json({ status: false, message: 'File not found' });
        }

        const fileURL = await getFile('PDF/' + fileKey + '.pdf');

        return res.status(200).json({
          status: true,
          message: 'Paper fetch successfully',
          link: fileURL,
        });
      } catch (err) {
        return res.status(400).json({ status: false, message: err.message });
      }
    },
  ],
};
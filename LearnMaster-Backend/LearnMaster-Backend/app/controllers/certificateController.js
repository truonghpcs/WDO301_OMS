const CertificateModel = require("../models/certificate");
const UserModel = require("../models/user");

const certificateController = {
  getAllCertificate: async (req, res) => {
    try {
      const dataAll = await CertificateModel.find({});
      res.status(200).json({ data: dataAll });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getCertificateById: async (req, res) => {
    try {
      const id = req.params.id;
      const dataAll = await CertificateModel.findById(id);
      res.status(200).json({ data: dataAll });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getCertificateByListId: async (req, res) => {
    try {
      const listId = req.body;
      const dataAll = await Promise.all(
        listId.map(async (id) => {
          return await CertificateModel.findById(id).exec();
        }),
      );
      res.status(200).json({ data: dataAll });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  createCertificate: async (req, res) => {
    const { title, slug, image } = req.body;
    try {
      const newCertificate = new CertificateModel({
        title,
        slug,
        image,
      });
      const saveData = await newCertificate.save();
      res.status(200).json({ data: { saveData } });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateCourse: async (req, res) => {
    const {
      title,
      description,
      slug,
      category,
      lessons,
      image,
      price,
      mentor,
    } = req.body;

    try {
      const updateData = {};

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (slug !== undefined) updateData.slug = slug;
      if (category !== undefined) updateData.category = category;
      if (lessons !== undefined) updateData.lessons = lessons;
      if (image !== undefined) updateData.image = image;
      if (price !== undefined) updateData.price = price;
      if (mentor !== undefined) updateData.mentor = mentor;

      const updatedCourse = await CourseModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true },
      );

      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({ data: updatedCourse });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteCourse: async (req, res) => {
    try {
      const deletedCourse = await CourseModel.findByIdAndDelete(req.params.id);

      if (!deletedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  searchCourse: async (req, res) => {
    const page = req.body.page || 1;
    const limit = req.body.limit || 10;
    const options = {
      page,
      limit,
      populate: [
        { path: "category", select: "name" },
        { path: "mentor", select: "username" },
      ],
    };

    const title = req.query.title;

    try {
      const courses = await CourseModel.paginate(
        { title: { $regex: `.*${title}.*`, $options: "i" } },
        options,
      );
      res.status(200).json({ data: courses });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getCoursesByCategory: async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
      const courses = await CourseModel.find({ category: categoryId }).populate(
        [
          { path: "category", select: "name" },
          { path: "mentor", select: "username" },
        ],
      );

      if (!courses || courses.length === 0) {
        return res
          .status(404)
          .json({ message: "No courses found for this category" });
      }

      res.status(200).json({ data: courses });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getCourseById: async (req, res) => {
    try {
      const course = await CourseModel.findById(req.params.id).populate(
        "mentor",
      );

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({ data: course });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  enrollCourse: async (req, res) => {
    const courseId = req.params.id;
    const userId = req.body.userId;

    try {
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.enrolledCourses.push(courseId);
      await user.save();

      res.status(200).json({ message: "Enrolled in course successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  unenrollCourse: async (req, res) => {
    const courseId = req.params.id;
    const userId = req.body.userId;

    try {
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.enrolledCourses = user.enrolledCourses.filter(
        (id) => id.toString() !== courseId,
      );
      await user.save();

      res.status(200).json({ message: "Unenrolled from course successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getCoursesByUserId: async (req, res) => {
    const userId = req.params.userId;

    try {
      // Tìm tất cả các khóa học mà người dùng là mentor
      const courses = await CourseModel.find({ mentor: userId }).populate([
        { path: "category", select: "name" },
        { path: "mentor", select: "username" },
      ]);

      if (!courses || courses.length === 0) {
        return res
          .status(404)
          .json({ message: "No courses found for this user" });
      }

      res.status(200).json({ data: courses });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
};

module.exports = certificateController;

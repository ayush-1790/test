import Blog from "../models/Blog.js";
import ExpressError from "../utils/ExpressError.js";

export const createBlog = async (req, res, next) => {
  try {
    const { title, content, isPublished } = req.body;
    const author = req.user._id || req.user.id; // Handling potential user object structure differences

    const blog = new Blog({
      title,
      content,
      author,
      isPublished,
    });

    await blog.save();

    res.status(201).json({
      success: true,
      data: blog,
      message: "Blog created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate("author", "name email");
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author", "name email");

    if (!blog) {
      throw new ExpressError(404, "Blog not found");
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, isPublished } = req.body;

    let blog = await Blog.findById(id);

    if (!blog) {
      throw new ExpressError(404, "Blog not found");
    }

    // Check if the user is the author (basic permission check)
    // Assuming req.user is populated by auth middleware
    const userId = req.user._id || req.user.id;
    if (blog.author.toString() !== userId.toString()) {
      // You might want to allow admins to edit too, but for "simple", strict ownership is fine or add role check
      // Check if user has admin role if needed, but for now stick to simple ownership
      // throw new ExpressError(403, "Not authorized to update this blog");
    }

    // Actually, let's keep it simple for now and rely on ownership OR admin if we had that context readily available.
    // Given the prompt "simple bloging application", I will enforce ownership for updates.
    if (blog.author.toString() !== userId.toString()) {
      // Let's check roles if available in req.user, though the user object structure might vary.
      // Based on previous files, roles might be populated.
      // For safety, let's just allow the author.
      throw new ExpressError(403, "Not authorized to update this blog");
    }

    blog = await Blog.findByIdAndUpdate(
      id,
      { title, content, isPublished },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: blog,
      message: "Blog updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new ExpressError(404, "Blog not found");
    }

    const userId = req.user._id || req.user.id;
    if (blog.author.toString() !== userId.toString()) {
      throw new ExpressError(403, "Not authorized to delete this blog");
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

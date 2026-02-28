// import { useParams } from "react-router-dom";
// import { blogs } from "../data/blogs";

// const BlogDetail = () => {
//   const { id } = useParams<{ id: string }>();

//   const blog = blogs.find((b) => b.id === id);

//   if (!blog) {
//     return <div className="p-20 text-center">Blog not found</div>;
//   }

//   return (
//     <section className="py-20 max-w-4xl mx-auto px-6">
//       <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>

//       <img
//         src={blog.image}
//         alt={blog.title}
//         className="w-full h-96 object-cover rounded-xl mb-8"
//       />

//       <div
//         className="prose max-w-none"
//         dangerouslySetInnerHTML={{ __html: blog.content }}
//       />
//     </section>
//   );
// };

// export default BlogDetail;

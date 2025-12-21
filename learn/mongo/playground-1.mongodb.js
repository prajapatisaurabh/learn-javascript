// The current database to use.
use("mongodbVSCodePlaygroundDB");

db.books.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details",
    },
  },
  {
    $addFields: {
      author_details: {
        $first: "$author_details",
      },
    },
  },
]);

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search(fields = []) {
    if (this.queryString.search) {
      const keyword = this.queryString.search;

      this.query = this.query.find({
        $or: fields.map((field) => ({
          [field]: {
            $regex: keyword,
            $options: "i",
          },
        })),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["search", "sort", "page", "limit", "fields"];

    excludedFields.forEach((field) => delete queryObj[field]);

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;

    const limit = Number(this.queryString.limit) || 10;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;

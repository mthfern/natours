class QueryBuilder {
  constructor(reqQuery, model) {
    this.reqQuery = reqQuery;
    this.dbSchema = model.schema.obj;
    this.dbQuery = model.find();
  }

  filter(opt = {}) {
    let { remove = [] } = opt;
    const { removeUnmatched = true } = opt;

    const queryObj = { ...this.reqQuery };

    // remove strings
    remove = [remove, ...['page', 'sort', 'limit', 'fields']];
    remove.forEach((resWord) => delete queryObj[resWord]);

    // remove unmatched properties
    if (removeUnmatched) {
      Object.entries(queryObj).forEach((prop) => {
        // if (!Object.prototype.hasOwnProperty.call(this.dbSchema, prop[0])) {
        if (!(prop[0] in this.dbSchema)) {
          delete queryObj[prop[0]];
        }
      });
    }

    // add operators
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.dbQuery = this.dbQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.dbQuery = this.dbQuery.sort(sortBy);
    } else {
      this.dbQuery = this.dbQuery.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(',').join(' ');
      this.dbQuery = this.dbQuery.select(fields);
    } else {
      this.dbQuery = this.dbQuery.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.dbQuery = this.dbQuery.skip(skip).limit(limit);

    return this;
  }
}

module.exports = QueryBuilder;

class APIFeatures {
  constructor(query, querStr) {
    this.query = query;
    this.querStr = querStr;
  }

  filter() {
    // 1A) Filtering
    const queryObj = { ...this.querStr };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    const keyword = queryObj.subject || '';
    const regex = new RegExp(keyword.split(' ').join('|'), 'i');

    const querStr = {
      subject: { $regex: regex },
    };

    this.query.find(querStr);

    return this;
  }

  sort() {
    if (this.querStr.sort) {
      const sortBy = this.querStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.querStr.fields) {
      console.log('Filtering fields');
      const fields = this.querStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.querStr.page * 1 || 1;
    const limit = this.querStr.limit * 1 || 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

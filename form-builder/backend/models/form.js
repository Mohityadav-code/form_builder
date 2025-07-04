// Placeholder for future Mongoose model
// In the future, replace with Mongoose schema and model

class Form {
  constructor({ id, name, description, fields, createdAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.fields = fields;
    this.createdAt = createdAt;
  }
}

module.exports = Form;

$(document).ready(function() {

  // Mock Backbone.sync
  Backbone.sync = function(method, model, options) {
    var deferred = $.Deferred();
    deferred.resolve(model.toJSON());
    return deferred.promise();
  };

  // Backform example - a person model with a nested address object
  var person = window.person = new Backbone.Model({
    id: 101,
    salutation: "Mr",
    firstName: "Andre",
    lastName: "Jones",
    adult: true,
    address: {
      address1: "1751 rue Richardson",
      address2: "Suite 3.105",
      city: "Montréal",
      postalCode: "H3K 1G6",
      province: "QC"
    },
    dateOfBirth: "1990-10-10",
    lifeGoal: "To become the best basketball player there is. I want to dunk!",
    favoriteNumber: 4,
    jsonValue: null
  });

  new Backform.Form({
    el: "#form",
    model: person,
    fields: [
      {name: "id", label: "Id", control: "uneditable-input"},
      {name: "firstName", label: "First Name", control: "input"},
      {name: "lastName", label: "Last Name", control: "input"},
      {name: "adult", label: "Adult", control: "checkbox"},
      {
        name: "salutation",
        label: "Salutation",
        control: "radio",
        options: [
          {label: "Mr.", value: "Mr"},
          {label: "Mrs.", value: "Mrs"},
          {label: "Mme.", value: "Mme"}
        ]
      },
      {control: "spacer"},
      {name: "address.address1", label: "Address1", control: "input"},
      {name: "address.address2", label: "Address2", control: "input"},
      {name: "address.city", label: "City", control: "input"},
      {name: "address.postalCode", label: "Postal Code", control: "input"},
      {
        name: "address.province",
        label: "Province",
        control: "select",
        options: [
          {label: "Alberta", value: "AB"},
          {label: "British Columbia", value: "BC"},
          {label: "Manitoba", value: "MB"},
          {label: "New Brunswick", value: "NB"},
          {label: "Newfoundland and Labrador", value: "NL"},
          {label: "Northwest Territories", value: "NT"},
          {label: "Nova Scotia", value: "NS"},
          {label: "Nunavut", value: "NU"},
          {label: "Ontario", value: "ON"},
          {label: "Prince Edward Island", value: "PE"},
          {label: "Québec", value: "QC"},
          {label: "Saskatchewan", value: "SK"},
          {label: "Yukon", value: "YT"}
        ]
      },
      {name: "dateOfBirth", label: "Date of birth", control: "datepicker", options: {format: "yyyy-mm-dd"}},
      {name: "lifeGoal", label: "Life goal", control: "textarea", extraClasses: ["fancy"], helpMessage: "Be creative!"},
      {name: "favoriteNumber", label: "Favorite Number", control: "input", type: "number"},
      {
        name: "jsonValue",
        label: "JSON value",
        control: "select",
        options: [
          {label: "null", value: null},
          {label: "true", value: true},
          {label: "false", value: false},
          {label: "0", value: 0},
          {label: "1", value: 1},
          {label: "99", value: 99},
          {label: "a string", value: "a string"}
        ]
      },
      {control: "button", label: "Save to server"}
    ],
    events: {
      "submit": function(e) {
        e.preventDefault();
        this.model.save().done(function(result) {
          console.log(result);
          alert("Form saved to server!");
        });
        return false;
      }
    }
  }).render();

  person.on("change", function() {
    $("#object").text(JSON.stringify(person.toJSON(), null, 2));
  }).trigger("change");

  // Example with question
  window.f = new Backform.Form({
    el: $("#form-question"),
    model: new Backbone.Model({toggle: false, years: 0}),
    fields: [{
      name: "toggle",
      label: "Are you a programmer?",
      control: "radio",
      options: [{label: "Yes", value: true}, {label: "No", value: false}]
    }, {
      name: "years",
      label: "For how many years?",
      disabled: function(m) { return m && m.get("toggle"); },
      control: Backform.InputControl.extend({
        initialize: function() {
          Backform.InputControl.prototype.initialize.apply(this, arguments);
          this.listenTo(this.model, "change:toggle", this.render);
        }
      })
    }]
  }).render();

  // Example with question (visible attribute)
  new Backform.Form({
    el: $("#form-visible"),
    model: new Backbone.Model({toggle: false, years: 0}),
    fields: [{
      name: "toggle",
      label: "Are you a programmer?",
      control: "radio",
      options: [{label: "Yes", value: true}, {label: "No", value: false}]
    }, {
      name: "years",
      label: "For how many years?",
      visible: function(m) {
          return m && m.get("toggle");
      },
      control: Backform.InputControl.extend({
        initialize: function() {
          Backform.InputControl.prototype.initialize.apply(this, arguments);
          this.listenTo(this.model, "change:toggle", this.render);
        }
      })
    }]
  }).render();

// Example with require input
  _.extend(Backform, {
    requiredInputClassName: "required"
  });
  new Backform.Form({
    el: $("#form-required"),
    model: new Backbone.Model({age: undefined}),
    fields: [{
      name: "age",
      label: "Age",
      control: "input",
      required: true
    }]
  }).render();
  // Deleting requiredInputClass for the next example
  _.extend(Backform, {
    requiredInputClassName: "required"
  });

  // Example with input of type email
  new Backform.Form({
    el: $("#form-email"),
    model: new Backbone.Model({email: "jonsnow@castlebla.ck", age:20}),
    fields: [{
      name: "email",
      label: "Email",
      control: "input",
      type: "email",
      required: true
    }, {
      name: "age",
      label: "Age",
      control: "input",
      type: "number",
      required: true
    }, {
      control: "button"
    }]
  }).render();

  $("#form-email").on("submit", function(e) {
    alert("Browser validation passed");
    return false;
  });

  // Example with deeply nested objects
  var personAndFamily = new Backbone.Model({
    "firstName": "Andre",
    "lastName": "Jones",
    "relatives": {
      "mother": {
        "firstName": "Elizabeth",
        "lastName": "Jones"
      },
      "father": {
        "firstName": "Douglas",
        "lastName": "Jones"
      }
    }
  });

  new Backform.Form({
    el: "#form-nested",
    model: personAndFamily,
    fields: [
      {name: "firstName", label: "First Name", control: "input"},
      {name: "lastName", label: "Last Name", control: "input"},
      {
        name: "relatives.mother.firstName",
        label: "Mother's First Name",
        control: "input",
      }, {
        name: "relatives.mother.lastName",
        label: "Mother's Last Name",
        control: "input",
      }, {
        name: "relatives.father.firstName",
        label: "Father's First Name",
        control: "input",
      }, {
        name: "relatives.father.lastName",
        label: "Father's Last Name",
        control: "input",
      }
    ]
  }).render();

  personAndFamily.on("change", function() {
    $("#nested-object").text(JSON.stringify(personAndFamily.toJSON(), null, 2));
  }).trigger("change");

  // Example with validation
  var MyModel = Backbone.Model.extend({
    defaults: {
      a: null
    },
    validate: function(attributes, options) {
      this.errorModel.clear();

      var number = this.get("a");
      if (isNaN(number))
        this.errorModel.set({a: "Not a number!"});
      else if (number <= 10 || number >= 20)
        this.errorModel.set({a: "Must be between 10 and 20"});

      if (!_.isEmpty(_.compact(this.errorModel.toJSON())))
        return "Validation errors. Please fix.";
    }
  });

  var form = new Backform.Form({
    el: "#form-validation",
    model: new MyModel(),
    fields: [{
      name: "a",
      label: "Type in a number between 10 and 20. Submit the form to validate.",
      control: "input",
      type: "number"
    }, {
      id: "submit",
      control: "button"
    }]
  }).render();

  form.$el.on("submit", function(e) {
    e.preventDefault();
    var submit = form.fields.get("submit");

    if (form.model.isValid())
      submit.set({status:"success", message: "Success!"});
    else
      submit.set({status:"error", message: form.model.validationError});

    return false;
  });

});

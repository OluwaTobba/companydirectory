let personnel = [];
let department = [];

// const baseUrl = "http://localhost/AyomikunEliabeth/companydirectory";
const baseUrl = "http://localhost/companydirectory";

GetAllPersonnel();

$("#searchInp").on("keyup", function () {
  // your code
  const value = $(this).val();
  if ($("#personnelBtn").hasClass("active")) {
    // Refresh personnel table
    // GetAllPersonnel();
    document.querySelector("#personnelTableBody").innerHTML = ``;
    personnel
      .filter((p) => p.firstName.toLowerCase().includes(value.toLowerCase()))
      .map((p) => {
        console.log("new p", p);
        document.querySelector("#personnelTableBody").innerHTML += `
        <tr>
                    <td class="align-middle text-nowrap">${p.lastName}, ${p.firstName}</td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">
                      ${p.jobTitle}
                    </td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">
                      ${p.location}
                    </td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">
                      ${p.email}
                    </td>
                    <td class="text-end text-nowrap">
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#editPersonnelModal"
                        data-id="${p.id}"
                      >
                        <i class="fa-solid fa-pencil fa-fw"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#deletePersonnelModal"
                        data-id="${p.id}"
                      >
                        <i class="fa-solid fa-trash fa-fw"></i>
                      </button>
                    </td>
                  </tr>
        `;
      });

    console.log("personnel", value);
  } else {
    if ($("#departmentsBtn").hasClass("active")) {
      // Refresh department table
      //   GetAllDepartment();
    } else {
      // Refresh location table
    }
  }
});

$("#refreshBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
    // Refresh personnel table
    GetAllPersonnel();
  } else {
    if ($("#departmentsBtn").hasClass("active")) {
      // Refresh department table
      GetAllDepartment();
    } else {
      // Refresh location table
      GetAllLocations();
    }
  }
});

$("#filterBtn").click(async function () {
  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
  $("#filterDepartment").html("");
  $("#filterLocation").html("");
  $("#filterModal").modal("toggle");
  var departments = await GetAllDepartment();
  var locations = await GetAllLocations();

  $.each(departments.data, function () {
    $("#filterDepartment").append(
      $("<option>", {
        value: this.id,
        text: this.name,
      })
    );
  });

  $.each(locations.data, function () {
    $("#filterLocation").append(
      $("<option>", {
        value: this.id,
        text: this.name,
      })
    );
  });
});

$("#filterForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
  // AddNewDepartment();
  FilterPersonnel();
});

$("#addBtn").click(function () {
  // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
  if ($("#personnelBtn").hasClass("active")) {
    // Refresh personnel table
    $("#addPersonnelModal").modal("show");
    $.ajax({
      url: `${baseUrl}/api/getAllDepartments.php`,
      type: "GET",
      dataType: "json",
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted
          console.log(result);
          $.each(result.data, function () {
            $("#addPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.name,
              })
            );
          });
        } else {
          $("#editPersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      },
    });
  } else {
    if ($("#departmentsBtn").hasClass("active")) {
      // open modal to add new department to table
      $("#addDepartmentModal").modal("show");
      $.ajax({
        url: `${baseUrl}/api/getAllLocations.php`,
        type: "GET",
        dataType: "json",
        success: function (result) {
          var resultCode = result.status.code;

          if (resultCode == 200) {
            // Update the hidden input with the employee id so that
            // it can be referenced when the form is submitted
            console.log(result);
            $.each(result.data, function () {
              $("#addDepartmentLocation").append(
                $("<option>", {
                  value: this.id,
                  text: this.name,
                })
              );
            });
          } else {
            $("#addDepartmentModal .modal-title").replaceWith(
              "Error retrieving data"
            );
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#addDepartmentModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        },
      });
    } else {
      // Open modal to add new location to table
      $("#addLocationModal").modal("show");
    }
  }
});

$("#personnelBtn").click(function () {
  // Call function to refresh personnel table
  GetAllPersonnel();
});

$("#departmentsBtn").click(async function () {
  // Call function to refresh department table
  await GetAllDepartment();
});

$("#locationsBtn").click(async function () {
  // Call function to refresh location table
  await GetAllLocations();
});

$("#editPersonnelModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: `${baseUrl}/api/getPersonnelByID.php`,
    type: "POST",
    dataType: "json",
    data: {
      // Retrieve the data-id attribute from the calling button
      // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
      // for the non-jQuery JavaScript alternative
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);

        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

        $("#editPersonnelDepartment").html("");

        $.each(result.data.department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
        });

        $("#editPersonnelDepartment").val(
          result.data.personnel[0].departmentID
        );
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
});

$("#deletePersonnelModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: `${baseUrl}/api/getPersonnelByID.php`,
    type: "POST",
    dataType: "json",
    data: {
      // Retrieve the data-id attribute from the calling button
      // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
      // for the non-jQuery JavaScript alternative
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#deletePersonnelEmployeeID")
          .val(result.data.personnel[0].id)
          .prop("disabled", true);
        $("#deletePersonnelFirstName")
          .val(result.data.personnel[0].firstName)
          .prop("disabled", true);
        $("#deletePersonnelLastName")
          .val(result.data.personnel[0].lastName)
          .prop("disabled", true);
        $("#deletePersonnelJobTitle")
          .val(result.data.personnel[0].jobTitle)
          .prop("disabled", true);
        $("#deletePersonnelEmailAddress")
          .val(result.data.personnel[0].email)
          .prop("disabled", true);

        $("#editPersonnelDepartment").html("");

        $.each(result.data.department, function () {
          $("#deletePersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
        });

        $("#deletePersonnelDepartment")
          .val(result.data.personnel[0].departmentID)
          .prop("disabled", true);
      } else {
        $("#deletePersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deletePersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
});

// Executes when the form button with type="submit" is clicked

$("#addPersonnelForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
  console.log(e);
  AddPersonnel();
});

$("#editPersonnelForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
  console.log("first");
  EditPersonnel();
});

$("#deletePersonnelForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
  // alert("delete");

  DeletePersonnel();
});

$("#editDepartmentModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: `${baseUrl}/api/getDepartmentByID.php`,
    type: "POST",
    dataType: "json",
    data: {
      // Retrieve the data-id attribute from the calling button
      // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
      // for the non-jQuery JavaScript alternative
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        console.log(result);
        $("#editDepartmentID").val(result.data.department[0].id);
        $("#editDepartmentName").val(result.data.department[0].name);

        $("#editPersonnelDepartment").html("");

        $.each(result.data.location, function () {
          $("#editDepartmentLocation").append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
        });

        $("#editDepartmentLocation").val(result.data.department[0].locationID);
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
});

$("#deleteDepartmentModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: `${baseUrl}/api/getDepartmentByID.php`,
    type: "POST",
    dataType: "json",
    data: {
      // Retrieve the data-id attribute from the calling button
      // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
      // for the non-jQuery JavaScript alternative
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        console.log(result);
        $("#deleteDepartmentID")
          .val(result.data.department[0].id)
          .prop("disabled", true);
        $("#deleteDepartmentName")
          .val(result.data.department[0].name)
          .prop("disabled", true);
        $("#deletePersonnelDepartment").html("");

        $.each(result.data.location, function () {
          $("#deleteDepartmentLocation").append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
        });

        $("#deleteDepartmentLocation")
          .val(result.data.department[0].locationID)
          .prop("disabled", true);
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteDepartmentModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
});

$("#addDepartmentForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
  AddNewDepartment();
});

$("#editDepartmentForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
  EditDepartment();
});

$("#deleteDepartmentForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
  DeleteDepartment();
});

$("#addLocationForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
  AddNewLocation();
});

$("#editLocationModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: `${baseUrl}/api/getLocationByID.php`,
    type: "POST",
    dataType: "json",
    data: {
      // Retrieve the data-id attribute from the calling button
      // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
      // for the non-jQuery JavaScript alternative
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result);
        $("#editLocationID").val(result.data[0].id);

        $("#editLocationName").val(result.data[0].name);

        // $("#editLocationModal").html("");
      } else {
        $("#editLocationModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editLocationModal .modal-title").replaceWith("Error retrieving data");
    },
  });
});

$("#deleteLocationModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: `${baseUrl}/api/getLocationByID.php`,
    type: "POST",
    dataType: "json",
    data: {
      // Retrieve the data-id attribute from the calling button
      // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
      // for the non-jQuery JavaScript alternative
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log("delete", result);
        $("#deleteLocationID").val(result.data[0].id);

        $("#deleteLocationName")
          .val(result.data[0].name)
          .prop("disabled", true);

        // $("#deleteLocationModal").html("");
      } else {
        $("#deleteLocationModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteLocationModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
});

$("#editLocationForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
  console.log("edit Location");
  EditLocation();
});

$("#deleteLocationForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
  DeleteLocation();
});

// FUNCTION TO CREATE, EDIT AND DELETE PERSONNEL
function GetAllPersonnel() {
  $("#personnelTableBody").html(`
        <p>please wait while retrieving data...</p>
        `);
  $.ajax({
    url: `${baseUrl}/api/getAll.php`,
    type: "GET",
    dataType: "json",
    success: function (result) {
      var resultCode = result.status.code;

     
      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        
        personnel = result.data;
        $("#personnelTableBody").html(``);
        [{
          lastname
        },{},{}]
        $.each(result.data, function () {
          $("#personnelTableBody").append(
            `<tr>
                    <td class="align-middle text-nowrap">${this.lastName}, ${this.firstName}</td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">
                      ${this.jobTitle}
                    </td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">
                      ${this.location}
                    </td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">
                      ${this.email}
                    </td>
                    <td class="text-end text-nowrap">
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#editPersonnelModal"
                        data-id="${this.id}"
                      >
                        <i class="fa-solid fa-pencil fa-fw"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#deletePersonnelModal"
                        data-id="${this.id}"
                      >
                        <i class="fa-solid fa-trash fa-fw"></i>
                      </button>
                    </td>
                  </tr>`
          );
        });
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#personnelTableBody p").replaceWith(
        "Error retrieving data"
      );
    },
  });
}

function AddPersonnel() {
  let lastName = $("#addPersonnelLastName").val();
  let firstName = $("#addPersonnelFirstName").val();
  let jobTitle = $("#addPersonnelJobTitle").val();
  let department = $("#addPersonnelDepartment").val();
  let email = $("#addPersonnelEmailAddress").val();

  $.ajax({
    url: `${baseUrl}/api/insertPersonnel.php`,
    type: "POST",
    dataType: "json",
    data: {
      lastName,
      firstName,
      jobTitle,
      departmentID: department,
      email,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result);
        $("#addPersonnelModal").modal("toggle");
        alert(result.status.description);
      } else {
        // $("#editPersonnelModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
        alert(result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
}

function EditPersonnel() {
  let id = $("#editPersonnelEmployeeID").val();
  let lastName = $("#editPersonnelLastName").val();
  let firstName = $("#editPersonnelFirstName").val();
  let jobTitle = $("#editPersonnelJobTitle").val();
  let department = $("#editPersonnelDepartment").val();
  let email = $("#editPersonnelEmailAddress").val();

  $.ajax({
    url: `${baseUrl}/api/editPersonnelByID.php`,
    type: "POST",
    dataType: "json",
    data: {
      id,
      lastName,
      firstName,
      jobTitle,
      departmentID: department,
      email,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result);
        $("#editPersonnelModal").modal("toggle");
        alert(result.status.description);
      } else {
        // $("#editPersonnelModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
        alert(result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
}

function DeletePersonnel() {
  let id = $("#deletePersonnelEmployeeID").val();

  $.ajax({
    url: `${baseUrl}/api/deletePersonnelByID.php`,
    type: "POST",
    dataType: "json",
    data: {
      id,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result);
        $("#deletePersonnelModal").modal("toggle");
        alert(result.status.description);
      } else {
        // $("#deletePersonnelModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
        alert(result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deletePersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
}

//
function SearchForPersonnel() {
  $("#departmentTableBody").html(`
        <p>please wait while retrieving data...</p>
        `);
  $.ajax({
    url: `${baseUrl}/api/getAllDepartments.php`,
    type: "GET",
    dataType: "json",
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result);
        $("#departmentTableBody").html(``);
        $.each(result.data, function () {
          $("#departmentTableBody").append(
            `<tr>
                <td class="align-middle text-nowrap">${this.name}</td>
                <td class="align-middle text-nowrap d-none d-md-table-cell">
                  ${this.location}
                </td>
                <td class="align-middle text-end text-nowrap">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#editDepartmentModal"
                    data-id="${this.id}"
                  >
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm deleteDepartmentBtn"
                    data-id="${this.id}"
                  >
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
              </tr>`
          );
        });
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
}

function FilterPersonnel() {
  let departmentID = $("#filterDepartment").val();
  let locationID = $("#filterLocation").val();

  $("#personnelTableBody").html(`
        <p>please wait while retrieving data...</p>
        `);
  $.ajax({
    url: `${baseUrl}/api/filterPersonnel.php`,
    type: "GET",
    dataType: "json",
    data: {
      departmentID,
      locationID,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result);
        personnel = result.data;
        $("#personnelTableBody").html(``);
        $.each(result.data, function () {
          $("#personnelTableBody").append(
            `<tr>
                    <td class="align-middle text-nowrap">${this.lastName}, ${this.firstName}</td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">
                      ${this.jobTitle}
                    </td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">
                      ${this.location}
                    </td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">
                      ${this.email}
                    </td>
                    <td class="text-end text-nowrap">
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#editPersonnelModal"
                        data-id="${this.id}"
                      >
                        <i class="fa-solid fa-pencil fa-fw"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#deletePersonnelModal"
                        data-id="${this.id}"
                      >
                        <i class="fa-solid fa-trash fa-fw"></i>
                      </button>
                    </td>
                  </tr>`
          );
        });
        $("#filterModal").modal("toggle");
      } else {
        $("#filterModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#filterModal .modal-title").replaceWith("Error retrieving data");
    },
  });
}

// FUNCTION TO CREATE, EDIT AND DELETE DEPARTMENT
function GetAllDepartment() {
  return new Promise((resolve, reject) => {
    $("#departmentTableBody").html(`
      <p>Please wait while retrieving data...</p>
    `);

    $.ajax({
      url: `${baseUrl}/api/getAllDepartments.php`,
      type: "GET",
      dataType: "json",
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          console.log(result);

          $("#departmentTableBody").html(``); // Clear the loading message

          $.each(result.data, function () {
            $("#departmentTableBody").append(
              `<tr>
                  <td class="align-middle text-nowrap">${this.name}</td>
                  <td class="align-middle text-nowrap d-none d-md-table-cell">
                    ${this.location}
                  </td>
                  <td class="align-middle text-end text-nowrap">
                    <button
                      type="button"
                      class="btn btn-primary btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#editDepartmentModal"
                      data-id="${this.id}"
                    >
                      <i class="fa-solid fa-pencil fa-fw"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary btn-sm deleteDepartmentBtn"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteDepartmentModal"
                      data-id="${this.id}"
                    >
                      <i class="fa-solid fa-trash fa-fw"></i>
                    </button>
                  </td>
                </tr>`
            );
          });
          resolve(result);
        } else {
          $("#departmentTableBody").html("<p>Error retrieving data</p>");
          reject(new Error("Error retrieving data"));
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#departmentTableBody").html("<p>Error retrieving data</p>");
        reject(new Error("Error retrieving data"));
      },
    });
  });
}

function AddNewDepartment() {
  let name = $("#addDepartmentName").val();
  let locationID = $("#addDepartmentLocation").val();

  $.ajax({
    url: `${baseUrl}/api/insertDepartment.php`,
    type: "POST",
    dataType: "json",
    data: {
      name,
      locationID,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result);
        $("#addDepartmentModal").modal("toggle");
        alert(result.status.description);
      } else {
        // $("#editPersonnelModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
        alert(result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
}

function EditDepartment() {
  let id = $("#editDepartmentID").val();
  let name = $("#editDepartmentName").val();
  let locationID = $("#editDepartmentLocation").val();

  $.ajax({
    url: `${baseUrl}/api/editDepartmentByID.php`,
    type: "POST",
    dataType: "json",
    data: {
      id,
      name,
      locationID,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result);
        $("#editDepartmentModal").modal("toggle");
        alert(result.status.description);
      } else {
        // $("#editDepartmentModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
        alert(result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editDepartmentModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
}
function DeleteDepartment() {
  let id = $("#deleteDepartmentID").val();

  console.log(id);

  $.ajax({
    url: `${baseUrl}/api/deleteDepartmentByID.php`,
    type: "POST",
    dataType: "json",
    data: {
      id,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result);
        $("#deleteDepartmentModal").modal("toggle");
        alert(result.status.description);
      } else {
        // $("#deleteDepartmentModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
        alert(result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteDepartmentModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
}

// FUNCTION TO CREATE, EDIT AND DELETE LOCATION
function GetAllLocations() {
  return new Promise((resolve, reject) => {
    $("#locationTableBody").html(`
      <p>Please wait while retrieving data...</p>
    `);

    $.ajax({
      url: `${baseUrl}/api/getAllLocations.php`,
      type: "GET",
      dataType: "json",
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          console.log(result);
          $("#locationTableBody").html(``); // Clear the loading message

          $.each(result.data, function () {
            $("#locationTableBody").append(
              `<tr>
                <td class="align-middle text-nowrap">${this.name}</td>
                <td class="align-middle text-end text-nowrap">
                  <button 
                    type="button" 
                    class="btn btn-primary btn-sm" 
                    data-bs-toggle="modal"
                    data-bs-target="#editLocationModal"
                    data-id="${this.id}">
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button 
                    type="button" 
                    data-bs-toggle="modal"
                    data-bs-target="#deleteLocationModal" 
                    class="btn btn-primary btn-sm" 
                    data-id="${this.id}">
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
              </tr>`
            );
          });
          resolve(result);
        } else {
          $("#locationTableBody").html("<p>Error retrieving data</p>");
          reject(new Error("Error retrieving data"));
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#locationTableBody").html("<p>Error retrieving data</p>");
        reject(new Error("Error retrieving data"));
      },
    });
  });
}

function AddNewLocation() {
  let name = $("#addLocationName").val();

  $.ajax({
    url: `${baseUrl}/api/insertLocation.php`,
    type: "POST",
    dataType: "json",
    data: {
      name,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result);
        $("#addLocationModal").modal("toggle");
        alert(result.status.description);
      } else {
        // $("#editPersonnelModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
        alert(result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
}

function EditLocation() {
  let id = $("#editLocationID").val();
  let name = $("#editLocationName").val();

  alert(id);

  $.ajax({
    url: `${baseUrl}/api/editLocationByID.php`,
    type: "POST",
    dataType: "json",
    data: {
      id,
      name,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result);
        $("#editLocationModal").modal("toggle");
        alert(result.status.description);
      } else {
        // $("#editLocationModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
        alert(result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editLocationModal .modal-title").replaceWith("Error retrieving data");
    },
  });
}

function DeleteLocation() {
  let id = $("#deleteLocationID").val();

  console.log(id);

  $.ajax({
    url: `${baseUrl}/api/deleteLocationByID.php`,
    type: "POST",
    dataType: "json",
    data: {
      id,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result);
        $("#deleteLocationModal").modal("toggle");
        alert(result.status.description);
      } else {
        // $("#deleteLocationModal .modal-title").replaceWith(
        //   "Error retrieving data"
        // );
        alert(result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteLocationModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
}

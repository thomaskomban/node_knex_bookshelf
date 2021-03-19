exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('fields').del()
  .then(function () {
    // Inserts seed entries
    return knex('fields').insert([
      {
        id: 1,
        firstName: 'Nigel',
        lastName: 'Brown',
        email: 'nigelbrown@email.com',
        dob: '1980-09-08'
      },
      {
        id: 2,
        firstName: 'David',
        lastName: 'Kalouche',
        email: 'david@email.com',
        dob: '1982-05-20'
      },
      {
        id: 3,
        firstName: 'Amy',
        lastName: 'Benton',
        email: 'jaywon@email.com',
        dob: '1998-07-25'
      }
    ]);
  });
};
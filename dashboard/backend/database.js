const knex = require('knex');
const path = require('path');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'task_automator.sqlite')
  },
  useNullAsDefault: true
});

// Create tables if they don't exist
async function initializeDatabase() {
  console.log('Checking database tables...');
  
  const emailsTableExists = await db.schema.hasTable('emails');
  if (!emailsTableExists) {
    console.log('Creating emails table...');
    await db.schema.createTable('emails', (table) => {
      table.increments('id').primary();
      table.string('emailId').notNullable();
      table.string('threadId');
      table.string('from');
      table.string('subject');
      table.datetime('receivedAt');
      table.datetime('processedAt');
      table.string('category').defaultTo('uncategorized');
      table.string('priority').defaultTo('normal');
      table.boolean('followUpNeeded').defaultTo(false);
      table.datetime('followUpDate');
      table.string('workflowId');
    });
  }
  
  const actionsTableExists = await db.schema.hasTable('actions');
  if (!actionsTableExists) {
    console.log('Creating actions table...');
    await db.schema.createTable('actions', (table) => {
      table.increments('id').primary();
      table.integer('emailId').references('id').inTable('emails').onDelete('CASCADE');
      table.string('type');
      table.text('details'); // Store JSON as text
      table.boolean('success').defaultTo(true);
    });
  }
  
  console.log('Database initialization complete');
}

module.exports = { db, initializeDatabase };
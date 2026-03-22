const db = require('./db');

function seed() {
  const clientCount = db.prepare('SELECT COUNT(*) as count FROM clients').get();
  if (clientCount.count > 0) return; // Already seeded

  console.log('Seeding database...');

  const insertClient = db.prepare(
    'INSERT INTO clients (company_name, country, entity_type) VALUES (?, ?, ?)'
  );
  const insertTask = db.prepare(
    `INSERT INTO compliance_tasks (client_id, title, description, category, due_date, status, priority)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const clients = [
    { name: 'Apex Ventures Ltd', country: 'United Kingdom', entity: 'Pvt Ltd' },
    { name: 'BlueStar Holdings', country: 'United States', entity: 'LLC' },
    { name: 'Meridian Partners', country: 'Canada', entity: 'Partnership' },
    { name: 'Zenith Corp', country: 'Singapore', entity: 'Pvt Ltd' },
  ];

  const today = new Date();
  const daysFromNow = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().split('T')[0];
  };

  const seedData = db.transaction(() => {
    clients.forEach((c) => {
      const { lastInsertRowid: cid } = insertClient.run(c.name, c.country, c.entity);

      if (c.name === 'Apex Ventures Ltd') {
        insertTask.run(cid, 'Annual Corporation Tax Return', 'File CT600 with HMRC', 'Tax', daysFromNow(-10), 'Pending', 'High');
        insertTask.run(cid, 'VAT Return Q4', 'Submit quarterly VAT return', 'Filing', daysFromNow(-5), 'In Progress', 'High');
        insertTask.run(cid, 'Payroll Year-End', 'Submit P60s and final FPS', 'Payroll', daysFromNow(15), 'Pending', 'Medium');
        insertTask.run(cid, 'Annual Accounts Filing', 'File accounts at Companies House', 'Filing', daysFromNow(30), 'Pending', 'Medium');
      }

      if (c.name === 'BlueStar Holdings') {
        insertTask.run(cid, 'Federal Tax Return (Form 1120)', 'Annual federal corporate tax filing', 'Tax', daysFromNow(-20), 'Pending', 'High');
        insertTask.run(cid, 'State Tax Filing - Delaware', 'Delaware franchise tax report', 'Tax', daysFromNow(-3), 'In Progress', 'Medium');
        insertTask.run(cid, 'External Audit Q1', 'Quarterly external audit review', 'Audit', daysFromNow(20), 'Pending', 'High');
        insertTask.run(cid, 'Employee Benefits Compliance', 'Review 401k plan compliance', 'Legal', daysFromNow(45), 'Completed', 'Low');
      }

      if (c.name === 'Meridian Partners') {
        insertTask.run(cid, 'T2 Corporate Tax Return', 'CRA corporate income tax filing', 'Tax', daysFromNow(-7), 'Pending', 'High');
        insertTask.run(cid, 'GST/HST Return', 'Quarterly GST/HST remittance', 'Filing', daysFromNow(10), 'In Progress', 'Medium');
        insertTask.run(cid, 'Partnership Agreement Review', 'Annual legal review of partnership deed', 'Legal', daysFromNow(60), 'Pending', 'Low');
        insertTask.run(cid, 'Payroll Deductions Remittance', 'Monthly payroll source deductions', 'Payroll', daysFromNow(5), 'Pending', 'Medium');
      }

      if (c.name === 'Zenith Corp') {
        insertTask.run(cid, 'Corporate Income Tax (Form C)', 'IRAS annual corporate tax filing', 'Tax', daysFromNow(-15), 'In Progress', 'High');
        insertTask.run(cid, 'GST F5 Return', 'Quarterly GST return to IRAS', 'Filing', daysFromNow(-2), 'Pending', 'High');
        insertTask.run(cid, 'Annual General Meeting', 'Statutory AGM and minutes filing', 'Legal', daysFromNow(25), 'Pending', 'Medium');
        insertTask.run(cid, 'Transfer Pricing Documentation', 'Prepare TP docs for related-party transactions', 'Audit', daysFromNow(50), 'Completed', 'Low');
      }
    });
  });

  seedData();
  console.log('Seeding complete.');
}

module.exports = seed;

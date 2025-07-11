const prisma = require('../prisma/client');

exports.createPatient = async (req, res) => {
  try {
    const { name, dob, notes, email, contact } = req.body;

    const patient = await prisma.patient.create({
      data: { name, dob: new Date(dob), notes, email, contact },
    });

    // console.log(patient);
    return res.status(200).json(patient);
  } catch (err) {
    console.error('Error creating patient:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany();
    return res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    req.body.dob = new Date(req.body.dob); // Ensure dob is a Date object
    const updatePatient = await prisma.patient.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(updatePatient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    await prisma.patient.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

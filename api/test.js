module.exports = async function handler(req, res) {
  res.status(200).json({ 
    status: 'API is working!',
    message: 'PDF generation endpoint is available',
    timestamp: new Date().toISOString()
  });
}

const express = require('express');
const bodyParser = require('body-parser');
const indexRouter = require('./core/router');
const app = express();

app.use(bodyParser.json());

// Router
app.use('/api', indexRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

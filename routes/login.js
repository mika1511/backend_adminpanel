const express = require('express')
const router = express.Router();
const { addAdmin , getAdmin} = require('../data-access/AdminDao');
const { getAllAdmin } = require('../data-access/AdminDao');

router.use(express.json())

router.get('/test', async (req, res) => {
    res.status(200).send('API WORKING');  
  })
  
router.get('/', async (req, res) => {
    try {
            console.time();
            const users = await getAllAdmin();
            console.timeEnd();
            res.json(users)
    } catch (error) {
            console.error(error)
            res.status(500).json({err: `Something went wrong`})
    }
})
router.get('/:name', async (req, res) => {
    
    try {
        const name = req.params.name; 
        const user=await getAdmin(name)
            res.json(user)
    } catch (error) {
            console.error(error)
            res.status(500).json({err: `Something went wrong`})
    }
});


router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await addAdmin({ name, email, password });
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


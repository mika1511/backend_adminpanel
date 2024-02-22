const express = require('express');
const { getALLCases, getCaseById, intializeCases, intializeTasks, getALLTasks } = require('../data-access/CustomerDao');
const router = express.Router();

router.use(express.json())

router.get('/test', async (req, res) => {
    res.status(200).send(' CUSTOMER CARE API WORKING');  
  })

router.get('/', async (req, res) => {
    try {
            console.time();
            const cases = await getALLCases();
            console.timeEnd();
            res.json(cases)
    } catch (error) {
            console.error(error)
            res.status(500).json({err: `Something went wrong`})
    }
})

router.get('/:case_id', async (req, res) => {
    
    try {
        const caseId = req.params.case_id; 
        const user=await getCaseById(caseId)
            res.json(user)
    } catch (error) {
            console.error(error)
            res.status(500).json({err: `Something went wrong`})
    }
});


router.post('/', async (req, res) => {
    try {
       const data = req.body;
        const Cases = await intializeCases(data);
        res.send(Cases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/:case_id/tasks', async (req, res) => {
    try {
       const data = req.body;
        const Cases = await intializeTasks(data);
        res.send(Cases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:case_id/tasks', async (req, res) => {
    try {
            console.time();
            const tasks = await getALLTasks();
            console.timeEnd();
            res.json(tasks)
    } catch (error) {
            console.error(error)
            res.status(500).json({err: `Something went wrong`})
    }
})

router.get('/:case_id/tasks/:task_id', async (req, res) => {
    try {
       const data = req.body;
        const Cases = await intializeTasks(data);
        res.send(Cases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
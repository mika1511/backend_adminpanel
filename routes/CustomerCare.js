const express = require('express');
const { getALLCases, getCaseById, intializeCases, intializeTasks, getALLTasks , casePatchHandler, getTaskById, getAllCasesByStatus, getAllAgentCases } = require('../data-access/CustomerDao');
const router = express.Router();

router.use(express.json())

router.get('/test', async (req, res) => {
    res.status(200).send(' CUSTOMER CARE API WORKING');  
  });

  router.post('/cases', async (req, res) => {
    try {
       const data = req.body;
        const Cases = await intializeCases(data);
        res.send(Cases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/cases', async (req, res) => {
    try {
            console.time();
            const cases = await getALLCases();
            console.timeEnd();
            res.json(cases)
    } catch (error) {
            console.error(error)
            res.status(500).json({err: `Something went wrong`})
    }
});

router.get('/cases/status', async (req, res) => {
    
    try {
        const data = req.body;
        const user=await getAllCasesByStatus(data)
            res.json(user)
    } catch (error) {
            console.error(error)
            res.status(500).json({err: `Something went wrong`})
    }
});

router.get('/cases/:case_id', async (req, res) => {
    
    try {
        const caseId = req.params.case_id; 
        const user=await getCaseById(caseId)
            res.json(user)
    } catch (error) {
            console.error(error)
            res.status(500).json({err: `Something went wrong`})
    }
});

router.patch('/cases/:case_id/', async (req, res) => {

    try {
        const case_id = req.params.case_id;

        const{op, path, value} = req.body;
        const patch=await casePatchHandler({ case_id , op , path , value})
            res.json(patch)

    } catch (error) {
            console.error(error)
            res.status(500).json({err: `Something went wrong`})
    }
});

router.post('/cases/:case_id/tasks', async (req, res) => {
    try {
        const data=req.params;
        const Cases = await intializeTasks(data);
        res.send(Cases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/cases/:case_id/tasks', async (req, res) => {
    try {
            console.time();
            const tasks = await getALLTasks();
            console.timeEnd();
            res.json(tasks)
    } catch (error) {
            console.error(error)
            res.status(500).json({err: `Something went wrong`})
    }
});

router.get('/cases/:case_id/tasks/:task_id', async (req, res) => {
    try {

       const data = req.params;
        const Cases = await getTaskById(data);
        res.send(Cases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
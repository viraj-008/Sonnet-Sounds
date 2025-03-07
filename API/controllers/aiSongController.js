import dotenv from 'dotenv';
dotenv.config({ path: "./.env"});
import axios from "axios";
import { SongTaskId } from "../model/TaskIdModel.js";




const SUNO_URL=process.env.SUNO_URL
const SUNO_API_KEY=process.env.SUNO_API_KEY


export default async function aiController(req, res) {
  const { myPrompt } = req.body;

  if (!myPrompt) {
    return res.status(400).json({ msg: "Prompt is required" });
  }

  const payload = {
    customMode: false,
    instrumental: false,
    prompt: myPrompt,
    style: null,
    title: null,
    model: "V3_5",
    callBackUrl:"https://992d-2401-4900-8849-c95c-19df-b66c-b3ec-fb10.ngrok-free.app/api/job/callB",
  };

  try {
    console.log('jjj')
    const response = await axios.post(SUNO_URL, payload, {
    
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${SUNO_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("API Request Sent Successfully!");
    if(response.data.code==429){
      return res.status(400).json({msg:"The current credits are insufficient. Please top up."})
    }

    // Save task details to the database
    const taskId = response.data.data.taskId;
    await SongTaskId.create({
      User: req.user,
      TaskId: taskId,
      AudioUrl: "null",
      SongPrompt: myPrompt,
    });

    res.status(200).json({ taskId,msg: "Task created successfully" });
  } catch (error) {
    console.error("Error while making API request:", error.response?.data || error.message);
    res.status(500).json({ msg: error.msg });
  }
}

// Callback function for task completion
export async function callBack(req, res) {
  console.log("Callback Response Received:");
  console.log(req.body);

  const taskId = req.body.data.task_id;
  console.log("Task ID:", taskId);

  try {
    const fetchUrl = `${SUNO_URL}/record-info?taskId=${taskId}`;
    const response = await axios.get(fetchUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${SUNO_API_KEY}`,
      },
    });

    const audioUrl = response.data.data.response.sunoData[0]?.audioUrl;

    if (audioUrl) {
      const updatedTask = await SongTaskId.findOneAndUpdate(
        { TaskId: taskId },
        { AudioUrl: audioUrl },
        { new: true }
      );

      console.log("Audio URL Updated:", audioUrl);
      res.status(200).json({ audioUrl, updatedTask });
    } else {
      console.warn("Audio URL not found in response");
      res.status(404).json({ error: "Audio URL not found" });
    }
  } catch (error) {
    console.error("Error fetching record details:", error.message);
    res.status(500).json({ error: "Failed to fetch audio URL" });
  }
}

// Status endpoint to check the progress of a task
export async function getStatus(req, res) {
  const { taskId } = req.query;

  try {
    const task = await SongTaskId.findOne({ TaskId: taskId });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({
      taskId: task.TaskId,
      audioUrl: task.AudioUrl === "null" ? null : task.AudioUrl,
    });
  } catch (error) {
    console.error("Error fetching task status:", error.message);
    res.status(500).json({ error: "Failed to fetch task status" });
  }
}

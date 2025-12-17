package com.taskmanagement.taskmanagementbackend.service;

import com.taskmanagement.taskmanagementbackend.interfaces.TaskRepository;
import com.taskmanagement.taskmanagementbackend.models.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    // FIX: This is the missing method the Controller was looking for
    public List<Task> getTasksByUser(String userId) {
        return taskRepository.findByUserId(userId);
    }

    // FIX: Changed parameter back to Long id, as userId is a String property of the task
    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task != null) {
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setCompleted(taskDetails.isCompleted());
            task.setPriority(taskDetails.getPriority()); // Ensure metadata is updated
            return taskRepository.save(task);
        }
        return null;
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Task toggleTaskStatus(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setCompleted(!task.isCompleted());
        return taskRepository.save(task);
    }
}

package com.taskmanagement.taskmanagementbackend.controller;

import com.taskmanagement.taskmanagementbackend.models.Task;
import com.taskmanagement.taskmanagementbackend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {
    @Autowired
    private TaskService taskService;

@GetMapping
public List<Task> getAllTasks(@AuthenticationPrincipal OAuth2User principal) {
    // Extract the unique ID (usually 'email' or 'sub')
    String userId = principal.getAttribute("email");
    return taskService.getTasksByUser(userId);
}

@PostMapping
public Task createTask(@RequestBody Task task, @AuthenticationPrincipal OAuth2User principal) {
    String userId = principal.getAttribute("email");
    task.setUserId(userId); // Link the new task to the logged-in user
    return taskService.createTask(task);
}

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }



    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        return taskService.updateTask(id, taskDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @PatchMapping("/{id}/toggle")
public Task toggleTask(@PathVariable Long id) {
    return taskService.toggleTaskStatus(id);
}
}

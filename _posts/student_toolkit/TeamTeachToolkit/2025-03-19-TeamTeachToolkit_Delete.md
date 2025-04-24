---
toc: false
layout: post
title: Sign Up Page
permalink: /student/TeamTeachToolkit/delete
description: Sign up for team teach topics
---

<!-- Load Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>



<div class="team-teach-section">
  <div class="container mx-auto text-center text-white bg-gray-900 py-8 px-4">
    <div class="flex justify-center gap-4 mb-6">
      <button class="border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
        onclick="location.href='{{site.baseurl}}/student/TeamTeachToolkit/'">Home</button>
      <button class="border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
        onclick="location.href='{{site.baseurl}}/student/TeamTeachToolkit/grader'">Grader</button>
      <button class="border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
        onclick="location.href='{{site.baseurl}}/student/TeamTeachToolkit/generator'">Generator</button>
      <button class="border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
        onclick="location.href='{{site.baseurl}}/student/TeamTeachToolkit/review'">Review</button>
    </div>
    <p id="loggedInStudent" class="mb-4">Fetching student info...</p>
    <div class="border border-white rounded p-6">
      <h2 class="text-2xl font-bold mb-4">TEAM TEACH SIGNUP</h2>
      <div class="mb-6">
        <input type="text" id="topicName" class="w-full mb-3 px-3 py-2 bg-gray-700 text-white rounded" placeholder="Enter Team Teach Topic">
        <input type="date" id="topicDate" class="w-full mb-3 px-3 py-2 bg-gray-700 text-white rounded">
        <button id="addTopicBtn"
          class="border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition">Add Topic</button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-white border border-white">
          <thead>
            <tr class="bg-gray-800">
              <th class="py-2 px-4 border border-white">Topic</th>
              <th class="py-2 px-4 border border-white">Date</th>
              <th class="py-2 px-4 border border-white">Signed Up</th>
              <th class="py-2 px-4 border border-white">Actions</th>
            </tr>
          </thead>
          <tbody id="topicsList" class="text-sm"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<script type="module">
  import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  let loggedInStudent = null;

  async function fetchLoggedInStudent() {
    try {
      const response = await fetch(`${javaURI}/api/person/get`, fetchOptions);
      const data = await response.json();

      if (data && data.name) {
        loggedInStudent = data.name;
        document.getElementById("loggedInStudent").innerText = `Logged in as: ${loggedInStudent}`;
        fetchTopics();
      } else {
        document.getElementById("loggedInStudent").innerText = "Sign in to view page.";
      }
    } catch (error) {
      console.error("Error fetching logged-in student:", error);
      document.getElementById("loggedInStudent").innerText = "Error fetching student info.";
    }
  }

  async function fetchTopics() {
    try {
      let response = await fetch(`${javaURI}/api/topics/all`, fetchOptions);
      let topics = await response.json();

      let topicsList = document.getElementById("topicsList");
      topicsList.innerHTML = "";

      topics.forEach(topic => {
        let studentsText = "None";
        if (Array.isArray(topic.students)) {
          studentsText = topic.students.join(', ');
        } else if (topic.students && typeof topic.students === 'string') {
          studentsText = topic.students.split(',').join(', ');
        }

        let row = document.createElement("tr");
        row.innerHTML = `
          <td class="border border-white px-4 py-2">${topic.topicName}</td>
          <td class="border border-white px-4 py-2">${topic.date}</td>
          <td class="border border-white px-4 py-2">${studentsText}</td>
          <td class="border border-white px-4 py-2">
            <button class="border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition text-sm" data-topic-id="${topic.id}">
              Sign Up
            </button>
          </td>
        `;

        row.querySelector("button").addEventListener("click", function () {
          signUpForTopic(topic.id);
        });

        topicsList.appendChild(row);
      });

    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  }

  async function addTopic() {
    let topicName = document.getElementById("topicName").value;
    let topicDate = document.getElementById("topicDate").value;

    if (!topicName || !topicDate) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      let response = await fetch(`${javaURI}/api/topics/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topicName: topicName,
          date: topicDate
        })
      });

      if (response.ok) {
        document.getElementById("topicName").value = "";
        document.getElementById("topicDate").value = "";
        fetchTopics();
      } else {
        console.error("Failed to add topic");
      }
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  }

  async function signUpForTopic(topicId) {
    if (!loggedInStudent) {
      alert("Sign in to view page");
      return;
    }

    try {
      let response = await fetch(`${javaURI}/api/topics/${topicId}/signup?studentName=${encodeURIComponent(loggedInStudent)}`, {
        method: "PUT",
        headers: fetchOptions
      });

      if (response.ok) {
        fetchTopics();
      } else {
        console.error("Failed to sign up for topic");
        alert("Failed to sign up. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up for topic:", error);
      alert("Error signing up. Please try again.");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    fetchLoggedInStudent();
    document.getElementById("addTopicBtn").addEventListener("click", addTopic);
  });
</script>
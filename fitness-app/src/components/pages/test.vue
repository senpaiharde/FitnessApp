<script setup>
import { Transition, ref, computed } from 'vue';

// ─── 1. STATE ────────────────────────────────────────────────────────────────
// your existing refs...
const showStats = ref(true);
// ...

// new for this section:
const periodOptions = [7, 14, 30, 90, 360];
const period        = ref(7);
const showFilter    = ref(false);

// mock of “all users” — replace with your real data source or prop
// each user should have an array of dated values so you can slice by period
const allUsers = ref([
  { id: 1, name: 'Alice', avatarUrl: '/avatars/a.png', history: [ /* { date, value } */ ] },
  { id: 2, name: 'Bob',   avatarUrl: '/avatars/b.png', history: [ /* ... */ ] },
  // …
]);

// helper to sum up a user’s metric over the last N days
function computeTotal(user, days) {
  const cutoff = Date.now() - days * 24 * 3600 * 1000;
  return user.history
    .filter(entry => new Date(entry.date).getTime() >= cutoff)
    .reduce((sum, entry) => sum + entry.value, 0);
}

// sorted & annotated leaderboard
const leaderboard = computed(() =>
  allUsers.value
    .map(u => ({ ...u, total: computeTotal(u, period.value) }))
    .sort((a, b) => b.total - a.total)
);

// ─── 2. METHODS ─────────────────────────────────────────────────────────────
function selectPeriod(days) {
  period.value   = days;
  showFilter.value = false;
}

function viewDetails(user) {
  // your “more details” handler
  console.log('view details for', user);
}
</script>

<template>
  <!-- … your existing toggle/stats grid above … -->

  <!-- ─── 3. FILTER + LEADERBOARD ──────────────────────────────────────────── -->
  <section id="Daddy" class="leaderboard-section">
    <!-- filter button + dropdown -->
    <div class="filter-container">
      <button class="filter-btn" @click="showFilter = !showFilter">
        Last {{ period }} days ▼
      </button>
      <Transition name="fade">
        <ul v-if="showFilter" class="filter-dropdown">
          <li
            v-for="opt in periodOptions"
            :key="opt"
            @click="selectPeriod(opt)"
          >
            {{ opt }} days
          </li>
        </ul>
      </Transition>
    </div>

    <!-- the ranking table -->
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>#</th>
          <th>User</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, i) in leaderboard" :key="user.id">
          <td>{{ i + 1 }}</td>
          <td class="user-cell">
            <img :src="user.avatarUrl" class="avatar" />
            {{ user.name }}
            <button class="details-btn" @click="viewDetails(user)">?</button>
          </td>
          <td>{{ user.total }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
/* FILTER */
.filter-container {
  position: relative;
  margin-bottom: 1rem;
}
.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}
.filter-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  list-style: none;
  margin: 0.25rem 0 0;
  padding: 0;
  width: max-content;
}
.filter-dropdown li {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.filter-dropdown li:hover {
  background: #f5f5f5;
}

/* TABLE */
.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}
.leaderboard-table th,
.leaderboard-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.user-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.details-btn {
  margin-left: auto;
  background: transparent;
  border: none;
  cursor: pointer;
}

/* simple fade for dropdown */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
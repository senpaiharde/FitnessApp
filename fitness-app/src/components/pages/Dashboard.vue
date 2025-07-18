<script setup>
import {gymHealthFacts} from '../../utils/index';
const randomFact = gymHealthFacts[Math.floor(Math.random() * gymHealthFacts.length)];
</script>

<template>
    <section id="dashboard">
        <div class="card tip-container">
            <h2 >Welcome Natty</h2>
            <div>
              
                <p class="tip"><strong> Daily Tip</strong>
                <br/> Inject the Tip
            </p>
            </div>
        </div>
            </section>
      
</template>

<style scoped></style>

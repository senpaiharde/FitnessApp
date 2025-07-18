<script setup></script>

<template>
  <header>
    <h1>Fitness App</h1>
  </header>
  <main>
    <slot></slot>
    <!-- This slot will render the Welcome component or any other content passed to Layouts -->`
  </main>
  <footer>
    <small> Created by </small>
    <a href="https://github.com/senpaiharde" target="_blank">
      <img
        src="https://avatars.githubusercontent.com/u/66986422?v=4"
        alt="Logo"
       
      />
      <p>senpaiharde</p>
    </a>
  </footer>
</template>

<style scoped>
header,
footer,
main {
  display: flex;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem;
}
main{
    flex:1;

}
footer {
  flex-direction: column;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 3rem 0;
  padding-bottom: 4rem;
}
footer a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem;
  padding-right: 0.5rem;
  background: var(--background-muted);
  border-radius: 4rem;
  border: 1px solid transparent;
  transition: 200ms;
  text-decoration: none;

}
footer a img {
  aspect-ratio: 1;
  max-width: 30px;
  border-radius: 100%;
  

}
</style>

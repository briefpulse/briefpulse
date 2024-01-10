<script lang="ts">
	import { page } from '$app/stores';
</script>

<section class="container">
    <div class="card p-8 m-8">
        <h1 class="h2 mb-2">{$page.status}</h1>
        <h1 class="h3">{$page.error?.message}</h1>
    </div>
</section>
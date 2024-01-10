<script lang="ts">
	import '../app.postcss';
	import './styles.css';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { GithubSolid } from 'flowbite-svelte-icons';
	import Logo from '$lib/images/logo.svg';
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/" style="display: flex;">
					<img src={Logo} class="me-3 h-6 sm:h-9" alt="BriefPulse Logo" />
	  				<!-- <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">BriefPulse</span> -->
					<strong class="text-xl uppercase">BriefPulse</strong>
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a class="btn btn-sm variant-ghost-surface" href="/about">
					About
				</a>
				<a class="btn btn-sm variant-ghost-surface" href="/contact">
					Contact
				</a>
				<a class="btn btn-sm variant-ghost-surface" href="/">
					<span><GithubSolid size="md"/></span>
					<span>GitHub</span>
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
	<svelte:fragment slot="pageFooter">
		<AppBar>
			<svelte:fragment slot=lead>
				<p>Copyright © 2023 <span class="anchor">Heisenbug</span>. All rights reserved.</p>
			</svelte:fragment>
			<svelte:fragment slot=trail>
				<a href="/">BriefPulse</a>
				<a href="/about">About</a>
				<a href="/contact">Contact</a>
				<a href="/"><GithubSolid /></a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
</AppShell>

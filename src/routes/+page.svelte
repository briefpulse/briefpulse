<script lang="ts">
	import {
        AnnotationSolid,
        BugSolid,
	ClipboardOutline,
        DownloadOutline,
	EnvelopeSolid,
	ExclamationCircleOutline,
        FileInvoiceSolid,
        PalleteSolid,
        RocketSolid,
        TextCenterSolid,
        ThumbsDownSolid,
        ThumbsDownOutline,
        ThumbsUpSolid,
        ThumbsUpOutline,
	UploadOutline,
    } from 'flowbite-svelte-icons'

	import {
		clipboard,
		ConicGradient,
		FileDropzone,
		Tab,
		TabGroup,
		type ConicStop,
	} from "@skeletonlabs/skeleton";

	import {
		backendRequest,
		readFileContent,
	} from '$lib/utils';

	import { summarizeText as summarize } from '$lib/services/summarizer';

	const _predictFuncs = [_summarizeText, _summarizeFile];

	const conicStops: ConicStop[] = [
		{ color: 'transparent', start: 0, end: 20 },
		{ color: 'rgb(var(--color-primary-500))', start: 80, end: 100 }
	];

    let isBusy: boolean = false;
    let inputText: string;
	let inputFiles: FileList;
	
    let inputWarningText: string | null = null;
    let outputText: string | null = null;
    let usedInput: string;
    let title: string;
    let feedback: string = '';

    let tabSet: number = 0;

    $:hasInputFile = inputFiles?.length > 0;
    $:showInputWarning = inputWarningText !== null;
    $:hasOutput = outputText != null
	$:hasFeedback = !(feedback === '');

	async function _generateSummary(inputText: string) {
		try {
            isBusy = true;

            const result = await summarize(inputText);
            outputText = result.summary;
            title = result.title;

            hasFeedback = false;
			usedInput = inputText;
        } finally {
            isBusy = false;
        }
    }

    async function _summarizeText() {
        if (!inputText) {
            inputWarningText = 'Please make sure to input some text first ...';
            return;
        }
        inputWarningText = null;
        await _generateSummary(inputText);
    }
	
    async function _summarizeFile() {
		const file = inputFiles?.item(0);
		if (!file) {
		    inputWarningText = 'Please make sure to select a file first ...';
            return;	
		}
		
        inputWarningText = null;

		try {
			const content = await readFileContent(file);
			await _generateSummary(content);
		} catch (error) {
			if (error instanceof Error) {
				inputWarningText = error.message;
			}
		}
    }

    function handleSubmitClicked() {
        if (isBusy)
            return;
		_predictFuncs[tabSet]();
    }

    const handleDownloadClicked = () => {
        if (!outputText)
            return

        const blob = new Blob([outputText], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${title}.txt`;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    const handleFeedbackClicked = async (value: string) => {
        if (hasFeedback)
            return;
        hasFeedback = true;
        feedback = value;

		try {
			const data = {
				input_text: usedInput || 'input text',
				output_text: outputText || 'output text',
				satisfaction: value,
			}
			await backendRequest(data, 'send-feedback/');
		}
		catch (error: unknown) {
			console.log('an unexpected error has occurred', error);
		}
    }

	const handleTabChanged = () => {
		inputWarningText = null;
	}

	const scrollToSection = (id: string) => {
		const section = document.getElementById(id);
		if (section) {
			section.scrollIntoView({ behavior: 'smooth' });
		}
  	};
</script>

<svelte:head>
	<title>BriefPulse</title>
</svelte:head>

<!-- <div class="mb-8">
	<div class="header-banner">
		<div class="banner-title">
			<h1 class="h1">BRIEFPULSE</h1>
		</div>
	</div>
</div> -->
<div class="header-banner">
	<div class="banner-title">
		<h1 class="h1">BRIEFPULSE</h1>
	</div>
</div>
<section class="container">
	<!-- <div class="card p-4 mb-8"> -->
	<div class="card p-4 mt-8 mb-8">
		<h2 class="h2 mb-4">Welcome to BriefPulse!</h2>
		<p class="card-text">Have you ever found yourself skimming through lengthy articles, only to struggle recalling their main points afterward? We understand that time is precious, and digesting dense information can be overwhelming. Enter BriefPulse, your solution to efficiently distill the essence of any text. Our cutting-edge AI model is designed to swiftly and succinctly summarize articles, enabling you to save time and comprehend content effortlessly while effortlessly bypassing unnecessary details.</p>
	</div>
	<center>
		<button type="button" class="btn variant-ghost-primary" on:click={() => scrollToSection('app')}>
			<span><RocketSolid size="md"/></span>
			<span>Jump right in!</span>
		</button>
	</center>
	<div class="card p-4 mt-8">
		<h3 class="h3 mb-4">Purpose of this Model:</h3>
		<p class="card-text">Primarily tailored for English-language news articles, our AI model is adept at summarizing lengthy texts. While its capabilities extend beyond news to various languages and text types, its core strength lies in providing concise insights into blog posts and news items. Constantly evolving, our model is committed to expanding its functionalities, shaping a more prominent role in your daily life. We value user feedback, leveraging it to refine and enhance our model continually.</p>		
	</div>
	<hr class="!border-dashed mb-8 mt-8" />
	<div class="card p-4">
		<h3 class="h3 mb-4">How to Utilize:</h3>
		<p class="card-text">Experience the power of summarization for free! Whether it's for professional or academic purposes, BriefPulse enables you to distill information effortlessly. <a href="/">Click here</a> to get started instantly—simply paste your text or upload a text file. The model processes your input and presents a neatly summarized output below.</p>
	</div>
	<hr class="!border-dashed mb-8 mt-8" />
	<div class="card p-4">
		<div class="card-prop card variant-ghost">
			<div class="mr-4 card-icon"><PalleteSolid color="white" size="lg"/></div>
			<div>
				<b>Easy to use</b>
				<p>Available to all. Get output with just one step.</p>
			</div>
		</div>
		<div class="card-prop card variant-ghost">
			<div class="mr-4 card-icon"><BugSolid color="white" size="lg"/></div>
			<div>
				<b>Constantly improved</b>
				<p>We listen to your feedback and constantly train our AI for better results.</p>
			</div>
		</div>
		<div class="card-prop card variant-ghost">
			<div class="mr-4 card-icon"><AnnotationSolid color="white" size="lg"/></div>
			<div>
				<b>Freedom</b>
				<p>No limitations on what you can enter.</p>
			</div>
		</div>        
		<div class="card-prop card variant-ghost">
			<div class="mr-4 card-icon"><EnvelopeSolid color="white" size="lg"/></div>
			<div>
				<b>Anonymous</b>
				<p>We don't collect and use ANY personal information.</p>
			</div>
		</div>
	</div>
	<hr class="!border-dashed mb-8 mt-8" />
	<div class="card p-4 mb-8">
		<h3 class="h3 mb-4">Behind the Scenes:</h3>
		<p class="card-text">Built upon a pretrained model from HuggingFace, BriefPulse harnesses the knowledge gained from an extensive dataset of news articles. Specialized in delivering concise summaries while preserving crucial information, our model enhances HuggingFace's foundation, creating a seamless and efficient summarization tool for your convenience.</p>
		<br>
		<p class="card-text">Join BriefPulse today and elevate your reading experience—because understanding the essence of a text should be as effortless as a heartbeat.</p>
	</div>	
</section>
<section id="app" class="mt-16 mb-32">
	<div class="container">
		<h2 class="h2">Input</h2>
		<div class="card p-4 mt-8 mb-16">
			<TabGroup>
				<Tab bind:group={tabSet} name="tab1" value={0} on:change={handleTabChanged}>
					<div class="tab-display">
						<span class="mr-4"><TextCenterSolid/></span>
						<span>Write Text</span>
					</div>
				</Tab>
				<Tab bind:group={tabSet} name="tab2" value={1} on:change={handleTabChanged}>
					<div class="tab-display">
						<span class="mr-4"><FileInvoiceSolid/></span>
						<span>Upload File</span>
					</div>
				</Tab>
				<!-- Tab Panels --->
				<svelte:fragment slot="panel">
					{#if tabSet === 0}
						<textarea bind:value={inputText} class="textarea" rows="10" placeholder="Input anything ..."/>
					{:else if tabSet === 1}
						<FileDropzone name="files" multiple={false} accept=".txt, .docx, application/pdf" bind:files={inputFiles}>
							<svelte:fragment slot="lead">
								<div style="display: flex; justify-content: center;">
									<UploadOutline size="lg"/>
								</div>
							</svelte:fragment>
							<svelte:fragment slot="message">
								{#if hasInputFile}
									<strong>{inputFiles.item(0)?.name}</strong>
								{:else}
									<b>Upload a file</b> or drag and drop
								{/if}
							</svelte:fragment>
							<svelte:fragment slot="meta">TXT, DOCX and PDF allowed.</svelte:fragment>
						</FileDropzone>
						<div class="mb-2"></div>
					{/if}
				</svelte:fragment>
			</TabGroup>
			{#if showInputWarning}
				<aside class="alert variant-ghost-error">
					<ExclamationCircleOutline />
					<p><strong>Input Error!</strong> {inputWarningText}</p>
				</aside>
			{/if}
			{#if isBusy}
				<!-- Ignore -->
			{:else}
				<button type="button" class="btn variant-filled mt-4" style="width: 100%;" on:click={handleSubmitClicked}>Submit</button>
			{/if}
		</div>
		<h2 class="h2">Output</h2>
		{#if isBusy}
			<ConicGradient stops={conicStops} spin>Processing ...</ConicGradient>
		{:else}
			<div class="card p-4 mt-8">
				<textarea value={outputText} class="textarea" rows="10" placeholder="No output yet ..." readonly={true}/>
				{#if hasOutput}
					<div class="row mt-4">
						<div>
							<button type="button" class="btn variant-filled" use:clipboard={outputText ?? ''}>
								<span><ClipboardOutline size="md"/></span>
								<span>Copy</span>
							</button>
							<button type="button" class="btn variant-filled" on:click={handleDownloadClicked}>
								<span><DownloadOutline size="md"/></span>
								<span>Download</span>
							</button>
						</div>
						{#if hasFeedback}
							<div style="display: flex; align-items: center;">
								<span class="mr-2">Thanks for the feedback!</span>
								{#if feedback === 'yes'}
									<span class="btn-icon variant-filled-success"><ThumbsUpSolid /></span>
								{:else}
									<span class="btn-icon variant-filled-error"><ThumbsDownSolid /></span>
								{/if}
							</div>
						{:else}
							<div style="display: flex; align-items: center;">
								<span class="mr-2">Was this helpfull?</span>
								<div class="btn-group">
									<button type="button"  class="variant-filled-success" on:click={() => handleFeedbackClicked('yes')}>
										<span><ThumbsUpOutline size="md"/></span>
										<span>Yes</span>
									</button>
									<button type="button" class="variant-filled-error" on:click={() => handleFeedbackClicked('no')}>
										<span><ThumbsDownOutline size="md"/></span>
										<span>No</span>
									</button>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</section>

<style>
    .row {
        display: flex;
        align-items: center;
	justify-content: space-between;
    }
    .tab-display {
	display: flex;
    	align-items: center;
	height: 32px;
     }
    .card-text {
	font-size: large;
        margin: 0 32px;
        line-height: 32px
    }
    .card-prop {
	display: flex;
	margin: 12px 0;
        padding: 16px;
    }
    .card-icon {
	background-color: slateblue;
        border-radius: 16%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .header-banner {
	background-image: url('$lib/images/banner.jpg');
	background-size: cover;
	background-position: center;
	text-align: center;
	margin: 0;
	padding: 0;
	display: flex;
        align-items: center;
        justify-content: center;
	height: 256px;
    }
    .banner-title {
	font-size: 2.5em;
	margin: 0;
	color: whitesmoke;
	font-weight: 700;
        background-color: darkslateblue;
	width: 100%;
	height: 64px;
	display: flex;
    	align-items: center;
    	justify-content: center;
    }
</style>

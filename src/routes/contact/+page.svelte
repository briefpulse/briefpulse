<script lang="ts">
    import {
        CheckCircleOutline,
        EnvelopeOutline,
        ExclamationCircleOutline,
    } from "flowbite-svelte-icons";

    import { backendRequest } from "$lib/utils";

    let nameInput = '';
    let emailInput = '';
    let messageInput = '';

    let isNameValid = true;
    let isEmailValid = true;
    let isMessageValid = true;

    let showResponseMessage: boolean = false;
    let wasSuccessfull: boolean = false;

    async function handleSubmitClicked() {
        showResponseMessage = false;
        
        validateName();
        validateEmail();
        validateMessage();

        if (!isNameValid || !isEmailValid || !isMessageValid) {
            return;
        }

        try {
            const data = {
                email: emailInput,
                full_name: nameInput.trim(),
                message: messageInput.trim(),
            }
            const response = await backendRequest(data, 'send-contact/');
            showResponseMessage = true;

            if (response.ok) {
                wasSuccessfull = true
                resetForm();
            } else {
                wasSuccessfull = false;
            }
        } catch (error) {
            // console.error("Error sending feedback:", error);
            if (error instanceof Error) {
                console.error("Error sending feedback:", error.message);
            }
        }
    }

    const validateName = () => {
        isNameValid = nameInput.trim().length > 0;
    };

    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isEmailValid = emailRegex.test(emailInput)
    };

    const validateMessage = () => {
        isMessageValid = messageInput.trim().length > 0;
    };

    const resetForm = () => {
        nameInput = '';
        emailInput = '';
        messageInput = '';
    }
</script>

<svelte:head>
	<title>BriefPulse | Contact</title>
</svelte:head>

<h1 class="h1 mt-8 mb-2">CONTACT</h1>
<hr class="!border-t-2 mb-12" />

<section class="container">
    <p class="mb-8" style="text-align: center;">If you have any questions about the product or service, please do not hesitate to contact us.</p>
    <div class="card p-4">
        <label class="label">
            <span>Full Name *</span>
            <input
                class="input"
                type="text"
                placeholder="John Doe"
                bind:value={nameInput}
                on:input={validateName}
            />
            {#if !isNameValid}
                <p class="warning">This field is required</p>
            {/if}
        </label>
        <br>
        <label class="label">
            <span>Email *</span>
            <input
                class="input"
                type="email"
                placeholder="your@email.com"
                name="email"
                bind:value={emailInput}
                on:input={validateEmail}
            />
            {#if !isEmailValid}
                <p class="warning">Please input a valid email address</p>
            {/if}
        </label>
        <br>
        <label class="label">
            <span>Message</span>
            <textarea
                class="textarea"
                rows="4"
                name="message"
                placeholder="We would love to hear from you ..."
                bind:value={messageInput}
                on:input={validateMessage}
            />
            {#if !isMessageValid}
                <p class="warning">Please write your message</p>
            {/if}
        </label>
        <button type="button" class="btn variant-filled mt-8" on:click={handleSubmitClicked}>
            <span><EnvelopeOutline size="md"/></span>
            <span>Submit</span>
        </button>
    </div>
    {#if showResponseMessage}
        {#if wasSuccessfull}
            <aside class="alert variant-ghost-success mt-4">
                <CheckCircleOutline />
                <p><strong>Sent!</strong> The Form was submitted was successfully.</p>
            </aside>
        {:else}
            <aside class="alert variant-ghost-error mt-4">
                <ExclamationCircleOutline />
                <p><strong>Ooops ...</strong> Something went wrong!</p>
            </aside>
        {/if}
    {/if}
    <div class="mb-16" />
</section>

<style>
    .warning {
        color: crimson;
        font-size: 0.8em;
    }
</style>
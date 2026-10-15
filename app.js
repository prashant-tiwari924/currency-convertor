// ========================================
// CURRENCY API
// ========================================

const API_URL =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const FALLBACK_URL =
    "https://latest.currency-api.pages.dev/v1/currencies";


// ========================================
// HTML ELEMENTS
// ========================================

const dropdowns =
    document.querySelectorAll(".dropdown select");

const fromCurrency =
    document.querySelector(".from select");

const toCurrency =
    document.querySelector(".to select");

const button =
    document.querySelector("form button");

const amountInput =
    document.querySelector(".amount input");

const message =
    document.querySelector(".msg");


// ========================================
// GET UNIQUE CURRENCIES
// ========================================

const currencies =
    [...new Set(Object.values(countryList))];


// ========================================
// ADD CURRENCIES TO DROPDOWNS
// ========================================

dropdowns.forEach((select) => {

    currencies.forEach((currency) => {

        const option =
            document.createElement("option");

        option.value = currency;
        option.textContent = currency;


        // FROM = USD
        if (
            select.name === "from" &&
            currency === "USD"
        ) {
            option.selected = true;
        }


        // TO = INR
        if (
            select.name === "to" &&
            currency === "INR"
        ) {
            option.selected = true;
        }


        select.appendChild(option);

    });


    // Change flag
    select.addEventListener("change", (event) => {

        updateFlag(event.target);

    });

});


// ========================================
// FIND COUNTRY CODE
// ========================================

function getCountryCode(currency) {

    for (const countryCode in countryList) {

        if (
            countryList[countryCode] === currency
        ) {
            return countryCode;
        }

    }

    return null;
}


// ========================================
// UPDATE FLAG
// ========================================

function updateFlag(selectElement) {

    const currency =
        selectElement.value;

    const countryCode =
        getCountryCode(currency);

    if (!countryCode) {
        return;
    }


    const image =
        selectElement
            .parentElement
            .querySelector("img");


    image.src =
        `https://flagsapi.com/${countryCode}/flat/64.png`;
}


// ========================================
// GET EXCHANGE RATE
// ========================================

async function getExchangeRate(from, to) {

    // ------------------------------------
    // FIRST API
    // ------------------------------------

    try {

        const url =
            `${API_URL}/${from}.json`;

        console.log("Trying:", url);

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error("Primary API failed");
        }

        const data =
            await response.json();

        console.log("Primary API:", data);

        return data[from][to];

    }

    catch (error) {

        console.log(
            "Primary API failed. Trying fallback..."
        );

    }


    // ------------------------------------
    // FALLBACK API
    // ------------------------------------

    try {

        const fallbackUrl =
            `${FALLBACK_URL}/${from}.json`;

        console.log(
            "Trying fallback:",
            fallbackUrl
        );

        const response =
            await fetch(fallbackUrl);

        if (!response.ok) {
            throw new Error("Fallback API failed");
        }

        const data =
            await response.json();

        console.log(
            "Fallback API:",
            data
        );

        return data[from][to];

    }

    catch (error) {

        console.error(
            "Both APIs failed:",
            error
        );

        return null;
    }
}


// ========================================
// CONVERT CURRENCY
// ========================================

button.addEventListener(
    "click",
    async (event) => {

        event.preventDefault();


        // --------------------------------
        // GET AMOUNT
        // --------------------------------

        const amount =
            Number(amountInput.value);


        // --------------------------------
        // VALIDATE AMOUNT
        // --------------------------------

        if (
            isNaN(amount) ||
            amount <= 0
        ) {

            message.textContent =
                "Please enter a valid amount.";

            return;
        }


        // --------------------------------
        // GET CURRENCIES
        // --------------------------------

        const from =
            fromCurrency.value.toLowerCase();

        const to =
            toCurrency.value.toLowerCase();


        // --------------------------------
        // SAME CURRENCY
        // --------------------------------

        if (from === to) {

            message.textContent =
                `${amount} ${fromCurrency.value} = ${amount} ${toCurrency.value}`;

            return;
        }


        // --------------------------------
        // SHOW LOADING
        // --------------------------------

        message.textContent =
            "Getting exchange rate...";


        // --------------------------------
        // GET RATE
        // --------------------------------

        const rate =
            await getExchangeRate(from, to);


        // --------------------------------
        // API FAILED
        // --------------------------------

        if (
            rate === null ||
            rate === undefined
        ) {

            message.textContent =
                "Unable to convert. Please try again.";

            return;
        }


        // --------------------------------
        // CALCULATE
        // --------------------------------

        const convertedAmount =
            amount * rate;


        // --------------------------------
        // SHOW RESULT
        // --------------------------------

        message.textContent =
            `${amount} ${fromCurrency.value} = ${convertedAmount.toFixed(2)} ${toCurrency.value}`;


        console.log(
            `${amount} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`
        );

    }
);
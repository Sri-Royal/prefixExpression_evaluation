let exp = [];
let index = 0;
let stack = [];
let history = [];

const info = document.getElementById("info");
const input = document.getElementById("exp");

/* ===== SAVE STATE ===== */
function saveState(message, current = "") {
    history.push({
        index,
        stack: [...stack],
        current,
        message
    });
}

/* ===== RESTORE STATE ===== */
function restoreState(state) {
    index = state.index;
    stack = [...state.stack];

    document.getElementById("current").innerText = state.current;
    document.getElementById("postfix").innerText =
        stack.length ? stack[stack.length - 1] : "";

    info.innerText = state.message;
    renderStackTree();
}

/* ===== VALIDATE PREFIX (SPACE SEPARATED) ===== */
function isValidPrefix(tokens) {
    let count = 0;

    // Scan right → left
    for (let i = tokens.length - 1; i >= 0; i--) {
        let token = tokens[i];

        if (!isNaN(token)) {
            count++;
        } else if (["+", "-", "*", "/"].includes(token)) {
            if (count < 2) return false;
            count--;
        } else {
            return false;
        }
    }
    return count === 1;
}

/* ===== START ===== */
function start() {
    const value = input.value.trim();

    if (value === "") {
        info.innerText = "⚠ Enter a Prefix Expression";
        return;
    }

    // 👇 SPACE BASED TOKENIZATION
    exp = value.split(/\s+/);

    if (!isValidPrefix(exp)) {
        info.innerText = "⚠ Invalid Prefix Expression";
        return;
    }

    document.getElementById("visualSection").classList.remove("hidden");

    index = exp.length - 1; // start from right
    stack = [];
    history = [];

    document.getElementById("stack").innerHTML = "";
    document.getElementById("current").innerText = "";
    document.getElementById("postfix").innerText = "";

    info.innerText = "Prefix Evaluation Started";
    saveState("Evaluation Started");
}

/* ===== APPLY OPERATOR ===== */
function applyOperator(op, a, b) {
    a = Number(a);
    b = Number(b);

    switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b !== 0 ? a / b : "∞";
    }
}

/* ===== NEXT STEP ===== */
function nextStep() {

    // Final result
    if (index < 0 && stack.length === 1) {
        const result = stack.pop();
        info.innerText = `Final Result = ${result}`;
        document.getElementById("postfix").innerText = result;
        document.getElementById("current").innerText = "";
        saveState(`Final Result = ${result}`);
        renderStackTree();
        return;
    }

    if (index < 0) return;

    const current = exp[index--];
    let message = "";

    if (!isNaN(current)) {
        stack.push(current);
        message = `Operand ${current} pushed to stack`;
    } else {
        const a = stack.pop();
        const b = stack.pop();
        const result = applyOperator(current, a, b);
        stack.push(result);
        message = `Applied '${current}' on ${a} and ${b}`;
    }

    document.getElementById("current").innerText = current;
    document.getElementById("postfix").innerText =
        stack.length ? stack[stack.length - 1] : "";

    info.innerText = message;
    saveState(message, current);
    renderStackTree();
}

/* ===== PREVIOUS STEP ===== */
function prevStep() {
    if (history.length <= 1) return;
    history.pop();
    restoreState(history[history.length - 1]);
}

/* ===== STACK TREE ===== */
function renderStackTree() {
    const container = document.getElementById("stack");
    container.innerHTML = "";

    stack.forEach(val => {
        const node = document.createElement("div");
        node.className = "stack-node";
        node.innerText = val;
        container.appendChild(node);
    });
}

/* ===== INPUT RESET ===== */
input.addEventListener("input", () => {
    if (input.value.trim() === "") {
        exp = [];
        stack = [];
        index = 0;
        history = [];

        document.getElementById("visualSection").classList.add("hidden");
        document.getElementById("stack").innerHTML = "";
        document.getElementById("current").innerText = "";
        document.getElementById("postfix").innerText = "";

        info.innerText = "Enter a Prefix Expression and click Start";
    }
});

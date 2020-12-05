let camelCaseFirst = Math.random() < 0.5;

//format: {field: "arrayList", time: 3000ms, correct: true}
let camelCase = [];
let kebabCase = [];

let resets = [];
let resetAll = () => resets.forEach((v) => v());
let numFields = 0;

let popup = (s) => {
    document.querySelector('#popup-text').textContent = s;
    document.querySelector('#popup').classList.remove('hidden');
    document.querySelector('#ok').focus();
}

let state = 0
let changeCase = () => {
    if (state === 0 || state === 1) {
        resetAll();
        let word;
        if (camelCaseFirst) {
            word = ['camelCase', 'kebab-case'][state];
        } else {
            word = ['kebab-case', 'camelCase'][state];
        }
        popup(word + " now");
        state++;
    } else {
        done();
    }
}

let done = () => {
    popup("done");
    console.log({camelCaseFirst: camelCaseFirst})
    console.log(camelCase);
    console.log(kebabCase);

    let id = Math.random().toString(36).substring(2, 15);
    let csv = "id, keyboard, experience, preference, order, correct answer, time, correctness\n"
    for (let field of camelCase) {
        csv += `${id}, ${personalData.kb}, ${personalData.exp}, ${personalData.preference}, ` +
               `${camelCaseFirst ? 'camel first' : 'kebab first'}, ${field.field}, ` +
               `${field.time}, ${field.correct}\n`;
    }
    for (let field of kebabCase) {
        csv += `${id}, ${personalData.kb}, ${personalData.exp}, ${personalData.preference}, ` +
               `${camelCaseFirst ? 'camel first' : 'kebab first'}, ${field.field}, ` +
               `${field.time}, ${field.correct}\n`;
    }
    let iframe = document.createElement('iframe');
    iframe.src = 'data:application/octet-stream,' + encodeURIComponent(csv);
    document.body.append(iframe);
    iframe.style.visibility = 'hidden';
}

popup("practice");
document.querySelector('#ok').addEventListener('click', () => {
    document.querySelector('#popup').classList.add('hidden');
})

let personalData = {};

document.querySelector('#data-ok').addEventListener('click', () => {
    personalData.kb = document.querySelector('#kb').value;
    personalData.exp = document.querySelector('#exp').value;
    personalData.preference = document.querySelector('#pref').value;
    document.querySelector('#data').classList.add('hidden');
})

document.querySelectorAll('field').forEach(f => {
    numFields++;
    let field = document.createElement('span');

    let hint = f.getAttribute('hint');
    field.className = 'field';
    field.contentEditable = 'true';
    field.setAttribute('placeholder', hint);
    f.insertAdjacentElement('afterend', field);
    f.remove();
    let start = 0;
    let end = 0;
    let correct;
    field.addEventListener('focusout', () => {
        if (field.textContent !== '') {
            field.contentEditable = 'false';
            field.classList.remove('field');
            end = performance.now();
            let answer;
            let currentIsCamelcase = (state === 1 && camelCaseFirst) || (state === 2 && !camelCaseFirst)
            if (currentIsCamelcase) {
                answer = hint.split(' ').map((s, i) => {
                    if (i === 0) return s;
                    return s.split('').map((c, i) => {
                        if (i !== 0) return c;
                        return c.toUpperCase();
                    }).join('');
                }).join('');
            } else {
                answer = hint.split(' ').join('-');
            }
            correct = field.textContent === answer;
            if (state !== 0) {
                if (currentIsCamelcase) {
                    camelCase.push({field: answer, time: end - start, correct: correct});
                } else {
                    kebabCase.push({field: answer, time: end - start, correct: correct});
                }
            }
            numFields--;
            if (numFields === 0) {
                changeCase();
            }
        }
    });
    field.addEventListener('oninput', () => {
        if (start === 0) start = performance.now();
    });

    let reset = () => {
        field.textContent = '';
        field.contentEditable = 'true';
        field.classList.add('field');
        numFields++;
    }
    resets.push(reset);
});





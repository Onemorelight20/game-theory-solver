// Global variables
let currentChart = null;

// Tab handling
function openTab(evt, tabName) {
    const tabcontents = document.getElementsByClassName("tab-content");
    for (let tabcontent of tabcontents) {
        tabcontent.style.display = "none";
        tabcontent.classList.remove("active");
    }

    const tablinks = document.getElementsByClassName("tab-button");
    for (let tablink of tablinks) {
        tablink.classList.remove("active");
    }

    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = "block";
        selectedTab.classList.add("active");
    }

    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("defaultOpen").click();
});


function matrixToString(matrix) {
    return matrix.map(row => row.join(' ')).join('\n');
}

function stringToMatrix(str) {
    try {
        const matrix = str.trim().split('\n').map(row => 
            row.trim().split(/\s+/).map(num => {
                const parsed = parseFloat(num);
                if (isNaN(parsed)) throw new Error('Некоректне число');
                return parsed;
            })
        );
        
        const rowLength = matrix[0].length;
        if (!matrix.every(row => row.length === rowLength)) {
            throw new Error('Усі рядки повинні мати однакову довжину');
        }
        
        return matrix;
    } catch (e) {
        throw new Error('Некоректний формат матриці. Введіть числа, розділені пробілами.');
    }
}

function generateRandomMatrix2n() {
    const cols = parseInt(document.getElementById('graphCols').value);
    const c1 = parseInt(document.getElementById('graphC1').value);
    const c2 = parseInt(document.getElementById('graphC2').value);
    const forceSaddlePoint = document.getElementById('forceSaddlePoint2n').checked;
    
    const matrix = generateRandomMatrix(2, cols, c1, c2, forceSaddlePoint);
    document.getElementById('graphMatrix2n').value = matrixToString(matrix);
}

function generateRandomMatrixm2() {
    const rows = parseInt(document.getElementById('graphRows').value);
    const c1 = parseInt(document.getElementById('graphC1m2').value);
    const c2 = parseInt(document.getElementById('graphC2m2').value);
    const forceSaddlePoint = document.getElementById('forceSaddlePointm2').checked;
    
    const matrix = generateRandomMatrix(rows, 2, c1, c2, forceSaddlePoint);
    document.getElementById('graphMatrixm2').value = matrixToString(matrix);
}

// Matrix Generation and Handling
function generateRandomMatrix(rows, cols, c1, c2, forceSaddlePoint = false) {
    if (forceSaddlePoint) {
        return generateMatrixWithSaddlePoint(rows, cols, c1, c2);
    }

    let matrix = [];
    // Generate at least 4 different values
    let uniqueValues = new Set();
    while (uniqueValues.size < 4) {
        uniqueValues.add(Math.floor(Math.random() * (c2 - c1 + 1)) + c1);
    }
    let values = Array.from(uniqueValues);
    
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            if (values.length > 0 && Math.random() < 0.5) {
                row.push(values.pop());
            } else {
                row.push(Math.floor(Math.random() * (c2 - c1 + 1)) + c1);
            }
        }
        matrix.push(row);
    }
    return matrix;
}

function generateMatrixWithSaddlePoint(rows, cols, c1, c2) {
    // We'll create a matrix where element (i,j) will be a saddle point
    const saddleRow = Math.floor(Math.random() * rows);
    const saddleCol = Math.floor(Math.random() * cols);
    
    // Generate the saddle point value
    const saddleValue = Math.floor(Math.random() * (c2 - c1 - 10)) + c1 + 5; // Leave room for bigger and smaller values

    let matrix = [];
    let uniqueValues = new Set([saddleValue]);
    
    // Generate more unique values for diversity
    while (uniqueValues.size < 4) {
        let newValue = Math.floor(Math.random() * (c2 - c1 + 1)) + c1;
        if (newValue !== saddleValue) {
            uniqueValues.add(newValue);
        }
    }

    // Create the matrix ensuring saddle point properties
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            if (i === saddleRow && j === saddleCol) {
                // This is our saddle point
                row.push(saddleValue);
            } else if (i === saddleRow) {
                // In saddle row, all other values should be greater than saddle value
                row.push(saddleValue + Math.floor(Math.random() * 5) + 1);
            } else if (j === saddleCol) {
                // In saddle column, all other values should be less than saddle value
                row.push(saddleValue - Math.floor(Math.random() * 5) - 1);
            } else {
                // For other elements, ensure they don't create another saddle point
                if (Math.random() < 0.5) {
                    row.push(saddleValue + Math.floor(Math.random() * 5) + 1);
                } else {
                    row.push(saddleValue - Math.floor(Math.random() * 5) - 1);
                }
            }
        }
        matrix.push(row);
    }

    return matrix;
}

// Update the generation functions
function generatePureMatrix() {
    const rows = parseInt(document.getElementById('pureRows').value);
    const cols = parseInt(document.getElementById('pureCols').value);
    const c1 = parseInt(document.getElementById('pureC1').value);
    const c2 = parseInt(document.getElementById('pureC2').value);
    const forceSaddlePoint = document.getElementById('forceSaddlePoint').checked;
    
    const matrix = generateRandomMatrix(rows, cols, c1, c2, forceSaddlePoint);
    document.getElementById('pureMatrix').value = matrixToString(matrix);
}

function generateGraphMatrix() {
    const cols = parseInt(document.getElementById('graphCols').value);
    const c1 = parseInt(document.getElementById('graphC1').value);
    const c2 = parseInt(document.getElementById('graphC2').value);
    const forceSaddlePoint = document.getElementById('forceSaddlePoint').checked;
    
    const matrix = generateRandomMatrix(2, cols, c1, c2, forceSaddlePoint);
    document.getElementById('graphMatrix').value = matrixToString(matrix);
}

function generateLPMatrix() {
    const rows = parseInt(document.getElementById('lpRows').value);
    const cols = parseInt(document.getElementById('lpCols').value);
    const c1 = parseInt(document.getElementById('lpC1').value);
    const c2 = parseInt(document.getElementById('lpC2').value);
    const forceSaddlePoint = document.getElementById('forceSaddlePoint').checked;
    
    const matrix = generateRandomMatrix(rows, cols, c1, c2, forceSaddlePoint);
    document.getElementById('lpMatrix').value = matrixToString(matrix);
}

function solvePureStrategy() {
    try {
        const matrix = stringToMatrix(document.getElementById('pureMatrix').value);
        const rows = matrix.length;
        const cols = matrix[0].length;

        // Input validation
        if (rows < 2 || cols < 2) {
            throw new Error('Матриця повинна мати розмір щонайменше 2×2');
        }

        // Find all minimal elements in rows and their positions
        const rowMinsWithPositions = matrix.map((row, rowIdx) => {
            const min = Math.min(...row);
            const positions = row.map((val, colIdx) => val === min ? colIdx : -1)
                              .filter(pos => pos !== -1);
            return { value: min, rowIdx, colPositions: positions };
        });

        // Find all maximal elements in columns and their positions
        const colMaxsWithPositions = Array(cols).fill(0).map((_, colIdx) => {
            const colValues = matrix.map(row => row[colIdx]);
            const max = Math.max(...colValues);
            const positions = colValues.map((val, rowIdx) => val === max ? rowIdx : -1)
                                     .filter(pos => pos !== -1);
            return { value: max, colIdx, rowPositions: positions };
        });

        const maximin = Math.max(...rowMinsWithPositions.map(x => x.value));
        const minimax = Math.min(...colMaxsWithPositions.map(x => x.value));

        // Find all maximin strategies (there could be multiple)
        const maximinStrategies = rowMinsWithPositions
            .filter(x => x.value === maximin)
            .map(x => x.rowIdx);

        // Find all minimax strategies (there could be multiple)
        const minimaxStrategies = colMaxsWithPositions
            .filter(x => x.value === minimax)
            .map(x => x.colIdx);

        // Find all saddle points
        const saddlePoints = [];
        maximinStrategies.forEach(row => {
            minimaxStrategies.forEach(col => {
                if (matrix[row][col] === maximin && matrix[row][col] === minimax) {
                    saddlePoints.push({row: row + 1, col: col + 1, value: matrix[row][col]});
                }
            });
        });

        let result = "Детальний аналіз розв'язку гри у чистих стратегіях:\n\n";
        
        result += "1. Аналіз стратегій першого гравця (максимізуючого):\n";
        result += "   a) Знаходимо мінімальні значення для кожного рядка (гарантовані виграші):\n";
        rowMinsWithPositions.forEach(({value, rowIdx, colPositions}) => {
            result += `      Рядок ${rowIdx + 1}: ${value} (позиції: стовпці ${colPositions.map(x => x + 1).join(', ')})\n`;
        });
        result += `   б) Максимін (нижня ціна гри): ${maximin}\n`;
        result += `   в) Оптимальні максимінні стратегії: ${maximinStrategies.map(x => x + 1).join(', ')}\n`;
        if (maximinStrategies.length > 1) {
            result += "      [Гравець 1 може обрати будь-який з цих рядків]\n\n";
        } else {
            result += `      [Гравець 1 має обрати рядок ${maximinStrategies[0] + 1}]\n\n`;
        }

        result += "2. Аналіз стратегій другого гравця (мінімізуючого):\n";
        result += "   a) Знаходимо максимальні значення для кожного стовпця (можливі програші):\n";
        colMaxsWithPositions.forEach(({value, colIdx, rowPositions}) => {
            result += `      Стовпець ${colIdx + 1}: ${value} (позиції: рядки ${rowPositions.map(x => x + 1).join(', ')})\n`;
        });
        result += `   б) Мінімакс (верхня ціна гри): ${minimax}\n`;
        result += `   в) Оптимальні мінімаксні стратегії: ${minimaxStrategies.map(x => x + 1).join(', ')}\n`;
        if (minimaxStrategies.length > 1) {
            result += "      [Гравець 2 може обрати будь-який з цих стовпців]\n\n";
        } else {
            result += `      [Гравець 2 має обрати стовпець ${minimaxStrategies[0] + 1}]\n\n`;
        }

        result += "3. Аналіз рівноваги гри:\n";
        if (maximin === minimax) {
            result += `   а) Знайдено ${saddlePoints.length > 1 ? 'сідлові точки' : 'сідлову точку'}:\n`;
            saddlePoints.forEach(point => {
                result += `      - Позиція (${point.row}, ${point.col}) зі значенням ${point.value}\n`;
            });
            result += `   б) Ціна гри: ${maximin}\n`;
            result += "   в) Висновок: Гра має розв'язок у чистих стратегіях\n";
            if (saddlePoints.length > 1) {
                result += "      - Гравці можуть обрати будь-яку з знайдених сідлових точок\n";
                result += "      - Всі знайдені стратегії є рівноцінними за результатом\n";
            }
            result += "      - Відхилення від оптимальних стратегій невигідне обом гравцям\n";
        } else {
            result += "   а) Сідлова точка відсутня\n";
            result += `   б) Нижня ціна гри (максимін): ${maximin}\n`;
            result += `   в) Верхня ціна гри (мінімакс): ${minimax}\n`;
            result += "   г) Висновок: Гра не має розв'язку в чистих стратегіях\n";
            result += "      - Необхідно шукати розв'язок у змішаних стратегіях\n";
            result += `      - Ціна гри буде знаходитися в межах [${maximin}, ${minimax}]\n`;
            if (rows === 2 || cols === 2) {
                result += "      - Рекомендується застосувати графічний метод\n";
            } else {
                result += "      - Рекомендується застосувати метод лінійного програмування\n";
            }
        }

        document.getElementById('pureResult').textContent = result;
    } catch (error) {
        document.getElementById('pureResult').textContent = "Помилка: " + error.message;
    }
}

function solveLP() {
    try {
        const matrix = stringToMatrix(document.getElementById('lpMatrix').value);
        const rows = matrix.length;
        const cols = matrix[0].length;

        let result = "Формулювання та аналіз задачі лінійного програмування:\n\n";
        
        result += "1. Перетворення гри до задачі ЛП:\n";
        result += "   Вихідна матриця має розмірність " + rows + "×" + cols + "\n\n";

        result += "2. Задача максимізації для першого гравця:\n";
        result += "   а) Цільова функція:\n";
        result += "      v → max\n\n";
        result += "   б) Обмеження:\n";
        
        // Generate constraints for player 1
        for (let j = 0; j < cols; j++) {
            let constraint = matrix.map((row, i) => `${row[j]}y${i+1}`).join(' + ');
            result += `      ${constraint} ≥ v\n`;
        }
        
        result += `      y₁ + y₂ + ... + y${rows} = 1\n`;
        result += "      yᵢ ≥ 0 для всіх i = 1,...," + rows + "\n\n";

        result += "3. Задача мінімізації для другого гравця:\n";
        result += "   а) Цільова функція:\n";
        result += "      w → min\n\n";
        result += "   б) Обмеження:\n";
        
        // Generate constraints for player 2
        for (let i = 0; i < rows; i++) {
            let constraint = matrix[i].map((val, j) => `${val}x${j+1}`).join(' + ');
            result += `      ${constraint} ≤ w\n`;
        }
        
        result += `      x₁ + x₂ + ... + x${cols} = 1\n`;
        result += "      xⱼ ≥ 0 для всіх j = 1,...," + cols + "\n\n";

        result += "4. Взаємозв'язок між задачами:\n";
        result += "   а) Задачі є взаємно двоїстими\n";
        result += "   б) Оптимальні значення цільових функцій пов'язані співвідношенням:\n";
        result += "      v* = 1/w*\n\n";

        result += "5. Інтерпретація змінних:\n";
        result += "   а) Для першого гравця:\n";
        result += "      - yᵢ - компоненти оптимальної змішаної стратегії\n";
        result += "      - v - гарантований середній виграш (ціна гри)\n\n";
        result += "   б) Для другого гравця:\n";
        result += "      - xⱼ - компоненти оптимальної змішаної стратегії\n";
        result += "      - w - гарантований середній програш\n\n";

        result += "6. Отримання розв'язку:\n";
        result += "   а) Оптимальні стратегії першого гравця:\n";
        result += "      pᵢ = yᵢ* × v*\n\n";
        result += "   б) Оптимальні стратегії другого гравця:\n";
        result += "      qⱼ = xⱼ* / w*\n\n";

        result += "7. Рекомендації щодо розв'язання:\n";
        result += "   - Використати симплекс-метод для розв'язання обох задач\n";
        result += "   - Перевірити умови оптимальності\n";
        result += "   - Виконати нормування отриманих стратегій\n";
        result += "   - Перевірити правильність розв'язку підстановкою в обмеження\n";

        document.getElementById('lpResult').textContent = result;
    } catch (error) {
        document.getElementById('lpResult').textContent = "Помилка: " + error.message;
    }
}


function generateGraphMatrixM2() {
    const rows = parseInt(document.getElementById('graphCols').value);
    const c1 = parseInt(document.getElementById('graphC1').value);
    const c2 = parseInt(document.getElementById('graphC2').value);
    const forceSaddlePoint = document.getElementById('forceSaddlePoint').checked;

    const matrix = generateRandomMatrix(rows, 2, c1, c2, forceSaddlePoint);
    document.getElementById('graphMatrix').value = matrixToString(matrix);
}


// Function to create chart configuration
function createChartConfig(datasets, title) {
    return {
        type: 'line',
        data: { datasets },
        options: {
            responsive: true,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataset.label === 'Оптимальна точка') {
                                return `Оптимальна точка: (p=${context.parsed.x.toFixed(4)}, v=${context.parsed.y.toFixed(4)})`;
                            }
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'p - ймовірність першої стратегії',
                        font: { size: 14 }
                    },
                    min: 0,
                    max: 1
                },
                y: {
                    title: {
                        display: true,
                        text: 'Очікуваний виграш',
                        font: { size: 14 }
                    }
                }
            }
        }
    };
}

function solveGraphical() {
    try {
        if (currentChart) {
            currentChart.destroy();
        }

        const matrix = stringToMatrix(document.getElementById('graphMatrix').value);
        if (matrix.length !== 2) {
            throw new Error('Матриця повинна мати рівно 2 рядки для графічного методу');
        }

        const { optimumPoint, matrix: processedMatrix } = findOptimalGraphicalSolution(matrix, false);
        const datasets = createChartDatasets(processedMatrix, optimumPoint);
        const ctx = document.getElementById('graphCanvas').getContext('2d');
        currentChart = new Chart(ctx, createChartConfig(datasets, 'Графічний метод розв\'язання матричної гри (2×n)'));

        // Generate result text
        let result = "Оптимальний розв'язок гри:\n\n";
        if (optimumPoint) {
            result += `1. Оптимальні змішані стратегії першого гравця:\n`;
            result += `   p₁* = ${optimumPoint.p.toFixed(4)}\n`;
            result += `   p₂* = ${(1-optimumPoint.p).toFixed(4)}\n\n`;
            result += `2. Ціна гри: v = ${optimumPoint.v.toFixed(4)}\n`;
        } else {
            result += "Оптимальний розв'язок не знайдено в допустимій області (0,1)\n";
        }

        document.getElementById('graphResult').textContent = result;
    } catch (error) {
        document.getElementById('graphResult').textContent = "Помилка: " + error.message;
    }
}


// Helper function for generating random matrix with saddle point if needed
function generateRandomMatrix(rows, cols, c1, c2, forceSaddlePoint) {
    if (forceSaddlePoint) {
        return generateMatrixWithSaddlePoint(rows, cols, c1, c2);
    }

    let matrix = [];
    // Generate at least 4 different values
    let uniqueValues = new Set();
    while (uniqueValues.size < 4) {
        uniqueValues.add(Math.floor(Math.random() * (c2 - c1 + 1)) + c1);
    }
    let values = Array.from(uniqueValues);
    
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            if (values.length > 0 && Math.random() < 0.5) {
                row.push(values.pop());
            } else {
                row.push(Math.floor(Math.random() * (c2 - c1 + 1)) + c1);
            }
        }
        matrix.push(row);
    }
    return matrix;
}



// Function to calculate payoff value for a given probability and column
function calculatePayoff(matrix, colIndex, p) {
    // For 2×n matrix:
    // Payoff = p*a1j + (1-p)*a2j where j is the column index
    return p * matrix[0][colIndex] + (1-p) * matrix[1][colIndex];
}

function findOptimalGraphicalSolution(matrix, isM2) {
    // For m×2, transpose to make it easier to work with
    if (isM2) {
        matrix = matrix[0].map((_, i) => matrix.map(row => row[i]));
    }

    console.log("Input matrix:", matrix);
    
    let extreme_points = [];
    const numLines = matrix[0].length;
    
    // For each pair of lines, find intersection
    for (let i = 0; i < numLines; i++) {
        let points = [];
        for (let j = 0; j < numLines; j++) {
            if (i !== j) {
                let line1, line2;
                line1 = { a: matrix[0][i], b: matrix[1][i] };
                line2 = { a: matrix[0][j], b: matrix[1][j] };
                
                const intersection = findIntersection(
                    line1.a, line1.b,
                    line2.a, line2.b
                );

                console.log(`Checking intersection between lines ${i} and ${j}:`, intersection);
                
                if (intersection && intersection.p >= 0 && intersection.p <= 1) {
                    console.log(`Found intersection between lines ${i} and ${j}:`, intersection);
                    points.push(intersection);
                }
            }
        }
        
        console.log(`Points for line ${i}:`, points);
        
        if (points.length > 0) {
            // For m×2: find minimum point for this line's intersections
            if (isM2) {
                const minPoint = points.reduce((min, p) => p.v < min.v ? p : min);
                extreme_points.push(minPoint);
                console.log("Minimum point for line", i, ":", minPoint);
            }
            // For 2×n: find maximum point for this line's intersections
            else {
                const maxPoint = points.reduce((max, p) => p.v > max.v ? p : max);
                extreme_points.push(maxPoint);
                console.log("Maximum point for line", i, ":", maxPoint);
            }
            
        }
        console.log("Extreme points after line", i, ":", extreme_points);
    }

    console.log("Extreme points:", extreme_points);
    
    let optimumPoint = null;
    if (extreme_points.length > 0) {
        // For m×2: take maximum of minimums
        if (isM2) {
            optimumPoint = extreme_points.reduce((max, p) => p.v > max.v ? p : max);
        }
        // For 2×n: take minimum of maximums
        else {
            optimumPoint = extreme_points.reduce((min, p) => p.v < min.v ? p : min);
        }
    }

    console.log("Optimum point:", optimumPoint);

    return {
        optimumPoint,
        matrix: isM2 ? matrix[0].map((_, i) => matrix.map(row => row[i])) : matrix,
        isM2
    };
}

function findIntersection(a1, b1, a2, b2) {
    // Given two lines going from (0,a) to (1,b)
    const pointA = [0, a1];
    const pointB = [1, b1];
    const pointC = [0, a2];
    const pointD = [1, b2];

    console.log("Points:", pointA, pointB, pointC, pointD);

    // Calculate line coefficients
    const a1_coef = pointB[1] - pointA[1];
    const b1_coef = pointA[0] - pointB[0];
    const c1 = a1_coef * pointA[0] + b1_coef * pointA[1];

    const a2_coef = pointD[1] - pointC[1]; 
    const b2_coef = pointC[0] - pointD[0];
    const c2 = a2_coef * pointC[0] + b2_coef * pointC[1];

    const denominator = a1_coef * b2_coef - a2_coef * b1_coef;
    console.log("Denominator:", denominator);

    if (Math.abs(denominator) < 1e-10) {
        console.log("Lines are parallel");
        return null; // Lines are parallel
    }

    const x = (b2_coef * c1 - b1_coef * c2) / denominator;
    const y = (a1_coef * c2 - a2_coef * c1) / denominator;

    return { p: x, v: y };
}

// Update solve functions to pass isM2 parameter
function solveGraphical2n() {
    try {
        if (currentChart) {
            currentChart.destroy();
        }

        const matrix = stringToMatrix(document.getElementById('graphMatrix2n').value);
        if (matrix.length !== 2) {
            throw new Error('Матриця повинна мати рівно 2 рядки для графічного методу');
        }

        const result = findOptimalGraphicalSolution(matrix, false);
        const datasets = createChartDatasets(matrix, result.optimumPoint, false);
        const ctx = document.getElementById('graphCanvas2n').getContext('2d');
        currentChart = new Chart(ctx, createChartConfig(datasets, 'Графічний метод (2×n) - максимін'));

        let resultText = "Оптимальний розв'язок гри:\n\n";
        if (result.optimumPoint) {
            resultText += `1. Оптимальні змішані стратегії першого гравця (максимін):\n`;
            resultText += `   p₁* = ${result.optimumPoint.p.toFixed(4)}\n`;
            resultText += `   p₂* = ${(1-result.optimumPoint.p).toFixed(4)}\n\n`;
            resultText += `2. Ціна гри: v = ${result.optimumPoint.v.toFixed(4)}\n`;
        } else {
            resultText += "Оптимальний розв'язок не знайдено в допустимій області (0,1)\n";
        }

        document.getElementById('graphResult2n').textContent = resultText;
    } catch (error) {
        document.getElementById('graphResult2n').textContent = "Помилка: " + error.message;
    }
}

function solveGraphicalM2() {
    try {
        if (currentChart) {
            currentChart.destroy();
        }

        const matrix = stringToMatrix(document.getElementById('graphMatrixm2').value);
        if (matrix[0].length !== 2) {
            throw new Error('Матриця повинна мати рівно 2 стовпці для графічного методу');
        }

        const result = findOptimalGraphicalSolution(matrix, true);
        const datasets = createChartDatasets(matrix, result.optimumPoint, true);
        const ctx = document.getElementById('graphCanvasM2').getContext('2d');
        currentChart = new Chart(ctx, createChartConfig(datasets, 'Графічний метод (m×2) - мінімакс'));

        let resultText = "Оптимальний розв'язок гри:\n\n";
        if (result.optimumPoint) {
            resultText += `1. Оптимальні змішані стратегії другого гравця (мінімакс):\n`;
            resultText += `   q₁* = ${result.optimumPoint.p.toFixed(4)}\n`;
            resultText += `   q₂* = ${(1-result.optimumPoint.p).toFixed(4)}\n\n`;
            resultText += `2. Ціна гри: v = ${result.optimumPoint.v.toFixed(4)}\n`;
        } else {
            resultText += "Оптимальний розв'язок не знайдено в допустимій області (0,1)\n";
        }

        document.getElementById('graphResultM2').textContent = resultText;
    } catch (error) {
        document.getElementById('graphResultM2').textContent = "Помилка: " + error.message;
    }
}

function createChartDatasets(matrix, optimumPoint, isM2) {
    // Lines creation remains the same as in previous version
    let datasets = [];
    
    if (!isM2) {
        datasets = Array(matrix[0].length).fill(0).map((_, j) => ({
            label: `Стратегія ${j + 1}`,
            data: [
                { x: 0, y: matrix[0][j] },
                { x: 1, y: matrix[1][j] }
            ],
            borderColor: `hsl(${360 * j / matrix[0].length}, 70%, 50%)`,
            borderWidth: 2,
            tension: 0,
            fill: false
        }));
    } else {
        datasets = Array(matrix.length).fill(0).map((_, i) => ({
            label: `Стратегія ${i + 1}`,
            data: [
                { x: 0, y: matrix[i][0] },
                { x: 1, y: matrix[i][1] }
            ],
            borderColor: `hsl(${360 * i / matrix.length}, 70%, 50%)`,
            borderWidth: 2,
            tension: 0,
            fill: false
        }));
    }

    // Add optimal point if exists
    if (optimumPoint) {
        datasets.push({
            label: 'Оптимальна точка',
            data: [{
                x: optimumPoint.p,
                y: optimumPoint.v
            }],
            backgroundColor: 'red',
            borderColor: 'red',
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false,
            type: 'scatter'
        });
    }

    return datasets;
}


// Initialize default tab on load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("defaultOpen").click();
});
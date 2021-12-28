const process = require('process');
const cp = require('child_process');
const path = require('path');
const checkDate = require('./checks');


describe('Checker', () => {
    const startDate = new Date(2020, 0, 1);

    it('Validates subsequents dates', () => {
        expect(checkDate('0001_auto_20200101_0001.py', startDate)).toBe('0001_auto_20200101_0001.py');
    });

    it('Validates previous dates', () => {
        expect(checkDate('0001_auto_20190201_0001.py', startDate)).toBeNull();
    });

    it('Validates generic names', () => {
        expect(checkDate('0001_meaningful_name.py', startDate)).toBeNull();
    });
});

describe('Action', () => {
    const innerPath = path.join(__dirname, 'index.js');

    it('Throws error on invalid type', () => {
        const result = cp.spawnSync('node', [innerPath], {env: {INPUT_TYPE: 'invalid'}});
        expect(result.status).toBe(1);
        expect(result.stdout.toString()).toBe('::error::Invalid type provided, correct choices are "app" or "project".\n');
    });

    it('Throws error on invalid project', () => {
        const result = cp.spawnSync('node', [innerPath], {env: {
            INPUT_TYPE: 'project',
            'INPUT_BASE-DIRECTORY': './test_files/project',
            'INPUT_START-DATE': '2020-01-01T00:00:00'
        }});
        const stdout = result.stdout.toString();
        expect(result.status).toBe(1);
        expect(stdout).toContain('::error::Automatic migration names detected');
        expect(stdout).not.toContain('test_files/project/app/migrations/0001_auto_20191231_0000.py');
        expect(stdout).toContain('test_files/project/app/migrations/0002_auto_20200101_0100.py');
    });

    it('Throws error on invalid project', () => {
        const result = cp.spawnSync('node', [innerPath], {env: {
            INPUT_TYPE: 'app',
            'INPUT_BASE-DIRECTORY': './test_files/project/app',
            'INPUT_START-DATE': '2020-01-01T00:00:00'
        }});
        const stdout = result.stdout.toString();
        expect(result.status).toBe(1);
        expect(stdout).toContain('::error::Automatic migration names detected');
        expect(stdout).not.toContain('test_files/project/app/migrations/0001_auto_20191231_0000.py');
        expect(stdout).toContain('test_files/project/app/migrations/0002_auto_20200101_0100.py');
    });
});

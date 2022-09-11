const ecoindex = require('./../ecoindex.js');

describe('The ecoindex score', function() {
    var score;

    it('is maximum for an empty page', function() {
        score = ecoindex.getEcoindex(0, 0, 0);

        expect(score.score).toBe(100);
        expect(score.grade).toBe('A');
        expect(score.ghg).toBe(1);
        expect(score.water).toBe(1.5);
    });

    it('is minimum for the biggest possible page', function() {
        score = ecoindex.getEcoindex(594601, 3920, 223212.26);

        expect(score.score).toBe(0);
        expect(score.grade).toBe('G');
        expect(score.ghg).toBe(3);
        expect(score.water).toBe(4.5);
    });
});

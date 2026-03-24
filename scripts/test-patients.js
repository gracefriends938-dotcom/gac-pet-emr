const { getPatients } = require('./src/lib/sheets');
async function test() {
    const patients = await getPatients();
    console.log(patients.map(p => ({ dbId: p.dbId, name: p.name })));
}
test();

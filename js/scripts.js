/**
 * 3 er Pre entrega de Proyecto Final
 * 
 * Comision 71340
 * 
 * Juan Ignacio Armas
 */


const sim_form = document.querySelector('#add-simulation');
const simDiv = document.querySelector('#SimDiv');


//Formatear números
function formatNumber(input) {
  // Extraer el valor actual del campo y remover separadores de miles
  let value = input.value.replace(/\D/g, '');
  
  // Convertir el valor a un número y luego a una cadena con separadores de miles
  let formattedValue = parseInt(value).toLocaleString();
  
  // Actualizar el valor del campo con el valor formateado
  input.value = formattedValue;
}


//valida carga de Formulario
function validateFields() {
  const value = document.querySelector('#value').value;
  const amount = document.querySelector('#amount').value;
  const deadline = document.querySelector('#deadline').value;

  switch (true) {
    case parseInt(value.replace(/\./g, '')) <= 0:
      return true;
    case parseInt(amount.replace(/\./g, '')) <= 0 || parseInt(amount.replace(/\./g, '')) > parseInt(value.replace(/\./g, '')) * 0.75:
      return true;
    case parseInt(deadline) <= 0 || parseInt(deadline) > 31:
      return true;
    default:
    
  }
}


// crear Simulacion 

function createSim({value, amount, deadline,client}) {
  const sims = JSON.parse(localStorage.getItem('sims'));

  const ids = sims.map(sims => sims.id);

  const newSim = {
    id: ids.length > 0 ? Math.max(...ids) + 1 : 0,
    value,
    amount,
    deadline,
    client
  }
  sims.push(newSim);

  localStorage.setItem('sims', JSON.stringify(sims));
  appendSimDiv();
}

// eliminarTarea

function deleteSim(id) {
  const sims = JSON.parse(localStorage.getItem('sims'));
  const newSim = sims.filter(sim => sim.id != id);

  localStorage.setItem('sims', JSON.stringify(newSim));
  appendSimDiv();
};

// actualizarTarea

function updateSim(id, data) {
  const sims = JSON.parse(localStorage.getItem('sims'));
  const newSim = sims.map(sim => sim.id == id && sim.status == data.status);

  localStorage.setItem('sims', JSON.stringify(newSim));
  appendSimDiv();
}


// actualizar En Dom

function appendSimDiv() {

  let sims = [];

  if (JSON.parse(localStorage.getItem('sims'))) {
    sims = JSON.parse(localStorage.getItem('sims'));
  } else {
    localStorage.setItem('sims', JSON.stringify([]));
  }

  simDiv.innerHTML = "";

  sims.forEach(sim => {
    const sim_container = document.createElement('article');
    sim_container.className = 'sim';
    sim_container.id = `sim-${sim.id}`;
    const monthly_fee = parseInt(sim.amount.replace(/\./g, '')) * ((parseInt(sim.client.replace(/\./g, '')) / 100) / 12) / (1 - Math.pow(1 + (parseInt(sim.client.replace(/\./g, '')) / 100) / 12, -parseInt(sim.deadline.replace(/\./g, '')) * 12));
    
    sim_container.innerHTML = `
     <div>
        <p>Monto de la vivienda: $${sim.value}</p>
        <p>Monto solicitado: $${sim.amount}</p>
        <p>Plazo: ${sim.deadline} años</p>
        <p>TNA: ${sim.client}%</p>
      </div>

      <p>Cuota Mensual: $${monthly_fee.toFixed(2)}</p>

      <button id="btn-${sim.id}" class="btn-delete">Eliminar</button>
    `;

    simDiv.appendChild(sim_container);

    const deleteButton = document.querySelector(`#btn-${sim.id}`);
    deleteButton.addEventListener('click', (e) => {
      const id = e.target.id.split('-')[1];
      deleteSim(id);
      Toastify({
        text: "Simulacion eliminada con éxito",
        className: "deleted-sim",
        style: {
          background: 'crimson',
          padding: '32px',
          width: '500px',
          textAlign: "center"
        },
        duration: 1000,
        gravity: 'bottom'
      }).showToast();
    });
  });
}


//Recargar simulaciones

appendSimDiv();



// Eventos

sim_form.addEventListener('submit', (e) => {
  
  e.preventDefault();
  
  if (validateFields()) {
    Swal.fire({
      title: '¡Error!',
      text: 'Verifique los campos cargados',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    sim_form.reset();
  }
  else {
    const sim = {
      value: e.target[0].value,
      amount: e.target[1].value,
      deadline: e.target[2].value,
      client: e.target[3].value 
    }
    createSim(sim);
    Swal.fire({
      title: '¡Prestamo calculado exitosamente!',
      icon: 'success',
      confirmButtonText: 'Terminar'
    });
    sim_form.reset();
  }
});


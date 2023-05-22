
<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      filas: [],
      postre: [],
      copia: [],
      buscar: "",
      mostrarFormulario: false,
      filaSeleccionada: null,
      editando: false,
      //para cambiar de IP
      ip: "192.168.1.2",
    };
  },

  methods: {
    //Obtiene todos los productos de la BD
    obtenerDatosPostres() {
      const respuesta = axios
        .get("http://" + this.ip + ":3000/api/v1/products")
        .then((response) => {
          console.log(response.data.body);
          this.filas = response.data.body;
        });
    },

    //Obtiene un producto de la BD
    async obtenerDatoPostre() {
      const respuesta = axios
        .get("http://" + this.ip + ":3000/api/v1/product/" + this.buscar)
        .then((response) => {
          this.postre = response.data.body;
          console.log(this.postre);
          if (this.postre === null) {
            Swal.fire({
              title: 'Error',
              text: 'No se encontró el registro con id ' + this.buscar,
              icon: 'error'
            });
          }
        });

    },

    borrarDatoPostre(id) {
      const respuesta = axios
        .delete("http://" + this.ip + ":3000/api/v1/product/" + id)
        .then((response) => {
          this.obtenerDatosPostres();
        });
    },

    agregarDatoPostre() {
      if (
        isNaN(parseInt(document.getElementById("codigo").value)) ||
        !document.getElementById("nombre").value.trim() ||
        !document.getElementById("sabor").value.trim() ||
        !document.getElementById("tamano").value.trim() ||
        !document.getElementById("adicional").value.trim() ||
        isNaN(parseFloat(document.getElementById("precio").value))

      ) {
        Swal.fire({
          title: 'Error',
          text: 'Hay campos vacios',
          icon: 'error'

        });

      } else {
        let nuevoPostre = {
          codigo: parseInt(document.getElementById("codigo").value),
          nombre: document.getElementById("nombre").value.trim(),
          sabor: document.getElementById("sabor").value.trim(),
          tamano: document.getElementById("tamano").value.trim(),
          adicional: document.getElementById("adicional").value.trim(),
          precio: parseFloat(document.getElementById("precio").value),
        };
        this.vaciarCampos();
        if (this.editando === true) {
          console.log(this.nuevoPostre);
          let url = "http://" + this.ip + ":3000/api/v1/product/" + nuevoPostre.codigo;
          axios.put(url, nuevoPostre).then((response) => {
            this.vaciarCampos();
            if (this.buscar.trim().length >= 1) {
              this.obtenerDatoPostre();
            } else {
              this.obtenerDatosPostres();
            }

          });

        } else {
          //Hacemos la peticion a la bd
          let url = "http://" + this.ip + ":3000/api/v1/product/";
          axios.post(url, nuevoPostre).then((response) => {
            this.obtenerDatosPostres();
            this.vaciarCampos();
          });


        }



      }
      //verificamos si los campos estan vacios

    },
    //Vaciamos los campos
    vaciarCampos() {
      document.getElementById("codigo").value = "";
      document.getElementById("nombre").value = "";
      document.getElementById("sabor").value = "";
      document.getElementById("tamano").value = "";
      document.getElementById("adicional").value = "";
      document.getElementById("precio").value = "";
    },

    editarFila(index, codigo, nombre, sabor, tamano, adicional, precio) {
      document.getElementById("codigo").value = codigo;
      document.getElementById("nombre").value = nombre;
      document.getElementById("sabor").value = sabor;
      document.getElementById("tamano").value = tamano;
      document.getElementById("adicional").value = adicional;
      document.getElementById("precio").value = precio;

      this.editando = true;

      // Copiar la fila seleccionada en un nuevo objeto
      this.filaSeleccionada = Object.assign({}, this.filas[index]);
    },
    guardarCambios() {
      // Actualizar los datos de la fila seleccionada en la tabla
      this.filas.splice(
        this.filas.indexOf(this.filaSeleccionada),
        1,
        this.filaSeleccionada
      );

      // Limpiar la fila seleccionada
      this.filaSeleccionada = null;
    },
  },
  created() {
    this.obtenerDatosPostres();
  },
};
</script>

<template>
  <div class="row">
    <div class="encabezado">
      <img src="./assets/logoPostre.png" alt="logo" class="logo" />
      <button class="btnBuscar" @click="obtenerDatoPostre()">
        <i class="bi bi-search"></i>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" class="bi bi-search"
          viewBox="0 0 25 25">
          <path
            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
        <input type="text" id="idInput" class="inputBuscar" v-model="buscar" />
      </button>
      <button type="button" class="btnNuevo" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
        @click="vaciarCampos()">
        Nuevo Registro
      </button>
    </div>
  </div>

  <br />

  <div class="general">
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
      aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" id="mod">
          <div class="modal-header">
           
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="formModal">
              <div>
                <div class="row">
                  <div class="col">
                    <div :class="{ 'disabled': editando }">
                      <label class="label" for="codigo">Código:</label>
                      <input  class="labelModal" type="number" id="codigo" v-model="codigo" required />
                    </div>
                  </div>
                  <div class="col">
                    <label class="label" for="nombre" >Nombre:</label>
                    <input class="labelModal" type="text" id="nombre" v-model="nombre" />
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <label class="label" for="sabor" >Sabor:</label>
                    <input  class="labelModal" type="text" id="sabor" v-model="sabor" />
                  </div>

                  <div class="col">
                    <label class="label" for="tamano" >Tamaño:</label>
                    <input  class="labelModal" type="text" id="tamano" v-model="tamano" />
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <label class="label" for="adicional" >Adicional:</label>
                    <input  class="labelModal" type="text" id="adicional" v-model="adicional" />
                  </div>
                  <div class="col">
                    <label class="label" for="precio" >Precio:</label>
                    <input  class="labelModal" type="number" id="precio" v-model="precio" />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="d-flex justify-content-center">
            <div class="modal-footer">
              <button type="button" class="btnEnviar" data-bs-dismiss="modal" @click="agregarDatoPostre()">
                Enviar
              </button>
              <button type="button" class="btnVaciar"  @click="vaciarCampos()">
                Vaciar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="general">
      <div class="row">
        <div class="container" v-if="buscar.trim().length < 1">
          <table class="table table-lg">
            <thead class="thead-light">
              <tr>
                <th class="label">Código</th>
                <th class="label">Nombre</th>
                <th class="label">Sabor</th>
                <th class="label">Tamaño</th>
                <th class="label">Adicional</th>
                <th class="label">Precio</th>
                <th class="label">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fila, index) in filas" :key="index">
                <td class="inputTable">
                  {{ fila.codigo }}
                </td>
                <td class="inputTable">
                  {{ fila.nombre }}
                </td>
                <td class="inputTable">
                  {{ fila.sabor }}
                </td>
                <td class="inputTable">
                  {{ fila.tamano }}
                </td>
                <td class="inputTable">
                  {{ fila.adicional }}
                </td>
                <td class="inputTable">
                  {{ fila.precio }}
                </td>

                <td>
                  <button class="btn btn-warning" id="product.codigo" data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                    @click="editarFila(index, fila.codigo, fila.nombre, fila.sabor, fila.tamano, fila.adicional, fila.precio)">
                    <i class="bi bi-pencil"></i>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-pencil" viewBox="0 0 16 16">
                      <path
                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                    </svg>
                  </button>
                  <button class="btn btn-danger" id="product.codigo" @click="borrarDatoPostre(fila.codigo)">
                    <i class="bi bi-trash"></i>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
                      viewBox="0 0 16 16">
                      <path
                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                      <path
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                    </svg>
                  </button>
                </td>

              </tr>

            </tbody>
          </table>
        </div>

        <div v-if="buscar.trim().length >= 1">
          <table class="table table-light">
            <thead class="thead-light">
              <tr>
                <th class="label">Código</th>
                <th class="label">Nombre</th>
                <th class="label">Sabor</th>
                <th class="label">Tamaño</th>
                <th class="label">Topings</th>
                <th class="label">Precio</th>
                <th class="label">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="inputTable">{{ postre.codigo }}</td>
                <td class="inputTable">{{ postre.nombre }}</td>
                <td class="inputTable">{{ postre.sabor }}</td>
                <td class="inputTable">{{ postre.tamano }}</td>
                <td class="inputTable">{{ postre.adicional }}</td>
                <td class="inputTable">{{ postre.precio }}</td>
                <td>
                  <button class="btn btn-warning" id="product.codigo" data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                    @click="editarFila(index, postre.codigo, postre.nombre, postre.sabor, postre.tamano, postre.adicional, postre.precio)">
                    <i class="bi bi-pencil"></i>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-pencil" viewBox="0 0 16 16">
                      <path
                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                    </svg>
                  </button>
                  <button class="btn btn-danger" id="product.codigo" @click="borrarDatoPostre(fila.codigo)">
                    <i class="bi bi-trash"></i>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
                      viewBox="0 0 16 16">
                      <path
                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                      <path
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                    </svg>
                  </button>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>



<style >
.general {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.encabezado {

  background-color: #faefd6;

}

.btnNuevo {
  position: absolute;
  right: 0;
  margin-right: 120px;
  margin-top: 70px;
  border-radius: 15px;
  width: 140px;
  height: 40px;
  background-color: #f9aabb;
  border: #f9aabb;
  color: #544013;
  font-weight: bold;
}

.btnBuscar {
  position: absolute;
  right: 0;
  margin-right: 300px;
  margin-top: 70px;
  border-radius: 15px;
  width: 100px;
  height: 40px;
  background-color: #f9aabb;
  border: #f9aabb;
  color: #544013;
  
}

table {
  margin-left: auto;
  margin-right: auto;
}

.logo {
  width: 180px;
  height: 180px;
  margin-left: 50px;
  margin-top: 12px;
}

.inputBuscar {
  width: 50px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0);
  border: rgba(255, 255, 255, 0);
  border-radius: 15px;
  text-align: center;
}

.disabled {
  pointer-events: none;
  opacity: 0.5;
}


#mod{
  background-color: #FAEFD6;
}

.labelModal{
  border-radius: 15px;
  border: rgba(255, 255, 255, 0);
}

.btnEnviar{
  width: 100px;
  height: 40px;
  background-color: #F9AABB;
  border: rgba(255, 255, 255, 0);
  border-radius: 15px;
  text-align: center;
  color: #544013;
  font-weight: bold;
}

.btnVaciar{
  width: 100px;
  height: 40px;
  background-color: #D9D9D9;
  border: rgba(255, 255, 255, 0);
  border-radius: 15px;
  text-align: center;
  color: #544013;
  font-weight: bold;

}

.label{
  color: #544013;
  font-weight: bold;
}

.inputTable{
  color: #544013;
}

</style>

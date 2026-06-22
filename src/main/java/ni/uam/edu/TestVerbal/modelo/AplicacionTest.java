package ni.uam.edu.TestVerbal.modelo;

import lombok.Getter;
import lombok.Setter;
import ni.uam.edu.TestVerbal.enums.EstadoAplicacion;
import org.openxava.annotations.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Collection;

@Entity
@Getter
@Setter
@View(members =
        "DatosAplicacion {" +
                "evaluado;" +
                "test;" +
                "fechaInicio, fechaFinal;" +
                "estado" +
                "};" +
                "Respuestas {" +
                "respuestas" +
                "};" +
                "Resultado {" +
                "resultado" +
                "}"
)
@Tab(properties = "evaluado.primerNombre, evaluado.primerApellido, test.nombre, fechaInicio, estado")
public class AplicacionTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Hidden
    private Long id;

    @ManyToOne(optional = false)
    @Required
    private Evaluado evaluado;

    @ManyToOne(optional = false)
    @Required
    private TestComprensionVerbal test;

    private LocalDateTime fechaInicio;

    private LocalDateTime fechaFinal;

    @Enumerated(EnumType.STRING)
    private EstadoAplicacion estado = EstadoAplicacion.PENDIENTE;

    @OneToMany(mappedBy = "aplicacion", cascade = CascadeType.ALL)
    @ListProperties("pregunta.numero, opcionSeleccionada.letra, correcta")
    private Collection<RespuestaVerbal> respuestas;

    @OneToOne(mappedBy = "aplicacion", cascade = CascadeType.ALL)
    private ResultadoTest resultado;
}

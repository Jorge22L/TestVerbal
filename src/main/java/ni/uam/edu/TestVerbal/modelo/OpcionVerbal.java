package ni.uam.edu.TestVerbal.modelo;

import lombok.Getter;
import lombok.Setter;
import ni.uam.edu.TestVerbal.enums.LetraOpcion;
import org.openxava.annotations.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@View(members = "DatosOpcion {" +
        "pregunta;" +
        "letra;" +
        "texto;" +
        "correcta" +
        "}")
@Tab(properties = "pregunta.numero, letra, texto, correcta")
public class OpcionVerbal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Hidden
    private Long id;
    @ManyToOne(optional = false)
    @Required
    private PreguntaVerbal pregunta;
    @Required
    @Enumerated(EnumType.STRING)
    private LetraOpcion letra;
    @Required
    @Stereotype("MEMO")
    @Column(length = 1000)
    private String texto;
    private Boolean correcta = false;

    public Boolean getCorrecta() {
        return correcta;
    }
}

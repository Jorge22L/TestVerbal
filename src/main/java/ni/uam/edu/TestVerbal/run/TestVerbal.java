package ni.uam.edu.TestVerbal.run;

import org.openxava.util.*;

/**
 * Ejecuta esta clase para arrancar la aplicación.
 */

public class TestVerbal {

	public static void main(String[] args) throws Exception {
		DBServer.start("TestVerbal-db"); // Para usar tu propia base de datos comenta esta línea y configura src/main/webapp/META-INF/context.xml
		AppServer.run("TestVerbal"); // Usa AppServer.run("") para funcionar en el contexto raíz
	}

}

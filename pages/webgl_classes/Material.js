/* Material Class */
class Material {
    /**
        @brief Material constructor
        @param [ambient] vec3 material ambient color
        @param [diffuse] vec3 material diffuse color
        @param [specular] vec3 material specular color
        @param [shininess] float material shininess
    */
    constructor(ambient, diffuse, specular, shininess) {
        this.ambient = vec3.fromValues(ambient[0], ambient[1], ambient[2]);
        this.diffuse = vec3.fromValues(diffuse[0], diffuse[1], diffuse[2]);
        this.specular = vec3.fromValues(specular[0], specular[1], specular[2]);
        this.shininess = shininess;
    }

    /**
        @brief sets input shader material uniform values
    */
    SetUniforms(shader) {
        shader.SetVec3Uniform(Shader.MATERIAL_AMBIENT_UNIFORM, this.ambient);
        shader.SetVec3Uniform(Shader.MATERIAL_DIFFUSE_UNIFORM, this.diffuse);
        shader.SetVec3Uniform(Shader.MATERIAL_SPECULAR_UNIFORM, this.specular);
        shader.SetFloatUniform(Shader.MATERIAL_SHININESS_UNIFORM, this.shininess);
    }
}

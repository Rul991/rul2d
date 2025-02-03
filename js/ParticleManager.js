import DrawableObject from "./DrawableObject.js"
import Particle from "./Particle.js"
import Point from "./Point.js"
import { chooseFromArray, randomRange } from "./utils/numberWork.js"
import Vector2 from "./Vector2.js"

/**
 * Manages the generation and control of particles in a particle system.
 * Extends the Point class to represent the position of the particle manager.
 * @extends Point
 */

export default class ParticleManager extends Point {

    /**
     * Creates an instance of ParticleManager at the specified position.
     * 
     * @param {number} x - The x-coordinate of the ParticleManager.
     * @param {number} y - The y-coordinate of the ParticleManager.
     */

    constructor(x, y) {
        super(x, y)

        this.gravity = new Vector2
        this.particles = []
        this.drawableObjects = []

        this.lifeTime = 0
        this.currentSpawnTime = 0
        this.spawnTime = -1

        this.maxParticlesSpawnAtOneUpdate = 1
        this.remainingParticles = this.maxParticlesSpawnAtOneUpdate

        this.isOneShoot = false
        this.isPlaying = false
        this.isStart = false
        this.isTimeStop = false
        
        this.setCount(0)
        this.setSpawnRange()
        this.setVelocityRange()

        this.setSpawnDelay()
        this.setAngularVelocityRange()
    }

    /**
     * Sets the range for angular velocity when spawning particles.
     * 
     * @param {number} [min=0] - The minimum angular velocity.
     * @param {number} [max=0] - The maximum angular velocity.
     */

    setAngularVelocityRange(min = 0, max = 0) {
        this.angularVelocityRange = {min, max}
    }

    /**
     * Loads particle settings from a JSON configuration file.
     * 
     * @param {string} [src=''] - The URL of the JSON file to load.
     * @returns {Promise<void>} A promise that resolves when loading is complete.
     */

    async loadFromJSON(src = '') {
        let responce = await fetch(src)
        let data = await responce.json()

        for (const key in data) {
            let element = data[key]

            if(key == 'gravity') {
                let {x, y} = element
                this.setGravity(x, y)
            }
            else if(key == 'maxParticlesAtOneUpdate') {
                this.setMaxParticlesSpawnAtOneUpdate(element)
            }
            else if(key == 'spawnRange') {
                this.setSpawnRange(
                    new Point(element.min.x, element.min.y), 
                    new Point(element.max.x, element.max.y)
                )
            }
            else if(key == 'spawnDelay') {
                this.setRangeSpawnDelay(element.min, element.max)
            }
            else if(key == 'velocityRange') {
                this.setVelocityRange(
                    new Point(element.min.x, element.min.y), 
                    new Point(element.max.x, element.max.y)
                )
            }
            else if(key == 'particles' || key == 'drawableObjects') {
                continue
            }
            else if(this[key] !== undefined) {
                this[key] = element
            }
        }

        if(data.particleCount !== undefined) {
            this.setCount(data.particleCount)
        }
    }

    /**
     * Sets the maximum number of particles to spawn at one update.
     * 
     * @param {number} [value=1] - The maximum number of particles to spawn.
     */

    setMaxParticlesSpawnAtOneUpdate(value = 1) {
        this.maxParticlesSpawnAtOneUpdate = value
        this.remainingParticles = this.maxParticlesSpawnAtOneUpdate
    }

    /**
     * Starts the particle manager, enabling particle spawning.
     */

    play() {
        this.isPlaying = true
        this.isStart = true
        if(this.isOneShoot) {
            for (const particle of this.particles) {
                if(particle.isNeedRecreate) {
                    this.recreateParticle(particle)
                }
            }
        }
    }

    /**
     * Pauses the particle manager, stopping particle spawning.
     */

    pause() {
        this.isPlaying = false
    }

    /**
     * Sets the one-shot spawning mode for the particle manager.
     * 
     * @param {boolean} [value=false] - True for one-shot spawning; false for continuous.
     */

    setOneShoot(value = false) {
        this.isOneShoot = value
    }

    /**
     * Sets a fixed spawn delay for particles.
     * 
     * @param {number} [delay=0] - The delay time in milliseconds.
     */

    setSpawnDelay(delay = 0) {
        this.setRangeSpawnDelay(delay, delay)
    }

    /**
     * Sets the range for spawn delay of particles.
     * 
     * @param {number} [min=0] - The minimum spawn delay.
     * @param {number} [max=0] - The maximum spawn delay.
     */

    setRangeSpawnDelay(min = 0, max = 0) {
        this.spawnDelay = {min, max}
    }

    /**
     * Gets a random spawn delay based on the defined range.
     * 
     * @returns {number} A random spawn delay value.
     */

    getSpawnDelay() {
        let { min, max } = this.spawnDelay

        if(min == max) return min

        return randomRange(min, max, 2)
    }

    /**
     * Gets a random position for spawning a particle within the defined spawn range.
     * 
     * @returns {Point} A Point object representing the spawn position.
     */

    getRandomSpawnPosition() {
        return new Point(
            randomRange(this.x + this.spawnRange.min.x, this.x + this.spawnRange.max.x),
            randomRange(this.y + this.spawnRange.min.y, this.y + this.spawnRange.max.y)
        )
    }

    /**
     * Sets the lifespan of the particles.
     * 
     * @param {number} [value=0] - The lifetime value for particles in seconds.
     */

    setLifeTime(value = 0) {
        this.lifeTime = value
    }

    /**
     * Defines the spawn range for particles.
     * 
     * @param {Point} [min=new Point()] - The minimum spawn point.
     * @param {Point} [max=new Point()] - The maximum spawn point.
     */

    setSpawnRange(min = new Point, max = new Point) {
        this.spawnRange = {min, max}
    }

    /**
     * Defines the velocity range for particles.
     * 
     * @param {Point} [min=new Point()] - The minimum velocity point.
     * @param {Point} [max=new Point()] - The maximum velocity point.
     */

    setVelocityRange(min = new Point, max = new Point) {
        this.velocityRange = {min, max}
    }

    /**
     * Sets the gravitational force applied to particles.
     * 
     * @param {number} x - The x-component of the gravity vector.
     * @param {number} y - The y-component of the gravity vector.
     */

    setGravity(x, y) {
        this.gravity.setPosition(x, y)
    }

    /**
     * Recreates a particle by assigning random properties.
     * 
     * @param {Particle} [particle=new Particle()] - The particle to be recreated.
     * @returns {Particle} The recreated particle.
     */

    recreateParticle(particle = new Particle) {
        particle.setRandomAngularVelocity(this.angularVelocityRange.min, this.angularVelocityRange.max)
        particle.setRandomVelocity(this.velocityRange.min, this.velocityRange.max)
        particle.setDrawableObject(chooseFromArray(this.drawableObjects))
        particle.setLifeTime(this.lifeTime)
        
        return particle
    }

    /**
     * Sets the initial count of particles managed by the ParticleManager.
     * 
     * @param {number} [count=1] - The initial number of particles.
     */

    setCount(count = 1) {
        this.particleCount = count
        this.particles = []
        
        for (let i = 0; i < count; i++) {
            let particle = new Particle()
            particle.root = this
            this.recreateParticle(particle)

            this.particles.push(particle)
        }
        this.initObjects(this.particles)
    }

    /**
     * Finds and returns an unplaying particle from the particle pool.
     * 
     * @returns {Particle|null} An unplaying particle or null if none are available.
     */

    getUnplayingParticle() {
        for (const particle of this.particles) {
            if(!particle.isPlaying) return particle
        }

        return null
    }

    /**
     * Manages the playing of particles based on elapsed time.
     * 
     * @param {number} delta - The elapsed time since the last update.
     */

    playParticleByTime(delta = 0) {
        if(!this.isPlaying) return
        if(this.spawnTime == -1) this.spawnTime = this.getSpawnDelay()
        this.currentSpawnTime += delta

        if(!this.maxParticlesSpawnAtOneUpdate) return

        if(this.currentSpawnTime >= this.spawnTime) {
            this.currentSpawnTime = 0
            this.spawnTime = this.getSpawnDelay()
            this.remainingParticles = this.maxParticlesSpawnAtOneUpdate
            this.spawnUnplayingParticle()
        }
        else if(this.remainingParticles > 0) {
            this.spawnUnplayingParticle()
        }
    }

    /**
     * Spawns an unplaying particle if one is available.
     */

    spawnUnplayingParticle() {
        let particle = this.getUnplayingParticle()

        if(particle) {
            this.remainingParticles--
            let spawnPosition = this.getRandomSpawnPosition()
            particle.point = spawnPosition
            particle.setRandomAngularVelocity(this.angularVelocityRange.min, this.angularVelocityRange.max)
            particle.play()
        }
    }

    /**
     * Initializes the provided drawable objects in the particle system.
     * 
     * @param {GameObject[]} [objects] - An array of objects to initialize.
     */

    initObjects(objects = []) {
        if(!this.isInitialized) return
        
        objects.forEach(object => {
            if(!object.isInitialized) {
                object.init(this.canvas, this.camera, this.world)
            }
        })
    }

    /**
     * Sets the drawable objects that can be used by the particle manager.
     * 
     * @param {...DrawableObject} objects - The drawable objects to be used.
     */

    setDrawableObject(...objects) {
        this.drawableObjects = objects
        this.initObjects(this.drawableObjects)
    }

    /**
     * Initializes the particle manager with canvas, camera, and world settings.
     * 
     * @param {Object} canvas - The canvas element for rendering.
     * @param {Object} camera - The camera used for the scene.
     * @param {Object} world - The physics world where particles exist.
     */

    init(canvas, camera, world) {
        super.init(canvas, camera, world)
        this.initObjects(this.drawableObjects)
        this.initObjects(this.particles)
    }

    /**
     * Draws all active particles onto the specified rendering context.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */

    _draw(ctx = new CanvasRenderingContext2D) {
        if(!this.isStart) return
        if(!this.isVisible) return

        for (const particle of this.particles) {
            particle.draw(ctx)
        }
    }

    /**
     * Updates the particle manager state, including the particles.
     * 
     * @param {number} [delta=0] - The elapsed time since the last update.
     */

    update(delta = 0) {
        if(!this.isStart || this.isTimeStop) return
        let gravity = Vector2.toVector(this.gravity.point).multiplyOnNumber(delta)
        let updatedObjects = new Set()

        this.playParticleByTime(delta)
        
        for (const particle of this.particles) {
            if(particle.isPlaying) {
                particle.velocity.addPosition(gravity)

                let { drawableObject } = particle
                drawableObject.update(delta)

                if(!updatedObjects.has(drawableObject)) {
                    updatedObjects.add(drawableObject)
                }

                if(particle.isNeedRecreate && !this.isOneShoot && this.isPlaying) {
                    this.recreateParticle(particle)
                }
            }

            particle.update(delta)
        }
    }
}
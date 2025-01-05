import Particle from "./Particle.js"
import Point from "./Point.js"
import { chooseFromArray, randomRange } from "./utils/numberWork.js"
import Vector2 from "./Vector2.js"

export default class ParticleManager extends Point {
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

    setAngularVelocityRange(min = 0, max = 0) {
        this.angularVelocityRange = {min, max}
    }

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
            else if(key == 'particleCount') {
                this.setCount(element)
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
    }

    setMaxParticlesSpawnAtOneUpdate(value = 1) {
        this.maxParticlesSpawnAtOneUpdate = value
        this.remainingParticles = this.maxParticlesSpawnAtOneUpdate
    }

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

    pause() {
        this.isPlaying = false
    }

    setOneShoot(value = false) {
        this.isOneShoot = value
    }

    setSpawnDelay(delay = 0) {
        this.setRangeSpawnDelay(delay, delay)
    }

    setRangeSpawnDelay(min = 0, max = 0) {
        this.spawnDelay = {min, max}
    }

    getSpawnDelay() {
        let { min, max } = this.spawnDelay

        if(min == max) return min

        return randomRange(min, max, 2)
    }

    getRandomSpawnPosition() {
        return new Point(
            randomRange(this.x + this.spawnRange.min.x, this.x + this.spawnRange.max.x),
            randomRange(this.y + this.spawnRange.min.y, this.y + this.spawnRange.max.y)
        )
    }

    setLifeTime(value = 0) {
        this.lifeTime = value
    }

    setSpawnRange(min = new Point, max = new Point) {
        this.spawnRange = {min, max}
    }

    setVelocityRange(min = new Point, max = new Point) {
        this.velocityRange = {min, max}
    }

    setGravity(x, y) {
        this.gravity.setPosition(x, y)
    }

    recreateParticle(particle = new Particle) {
        particle.setRandomAngularVelocity(this.angularVelocityRange.min, this.angularVelocityRange.max)
        particle.setRandomVelocity(this.velocityRange.min, this.velocityRange.max)
        particle.setDrawableObject(chooseFromArray(this.drawableObjects))
        particle.setLifeTime(this.lifeTime)
        
        return particle
    }

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

    getUnplayingParticle() {
        for (const particle of this.particles) {
            if(!particle.isPlaying) return particle
        }

        return null
    }

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

    initObjects(objects = []) {
        if(!this.isInitialized) return
        
        objects.forEach(object => {
            if(!object.isInitialized) {
                object.init(this.canvas, this.camera, this.world)
            }
        })
    }

    setDrawableObject(...objects) {
        this.drawableObjects = objects
        this.initObjects(this.drawableObjects)
    }

    init(canvas, camera, world) {
        super.init(canvas, camera, world)
        this.initObjects(this.drawableObjects)
        this.initObjects(this.particles)
    }

    _draw(ctx = new CanvasRenderingContext2D) {
        if(!this.isStart) return
        if(!this.isVisible) return

        for (const particle of this.particles) {
            particle.draw(ctx)
        }
    }

    update(delta = 0) {
        if(!this.isStart || this.isTimeStop) return
        let gravity = Vector2.toVector(this.gravity.point).multiplyOnNumber(delta)
        let updatedObjects = new Set()

        this.playParticleByTime(delta)
        
        for (const particle of this.particles) {
            if(particle.isPlaying) {
                particle.velocity.addPosition(gravity)

                let { drawableObject } = particle

                if(!updatedObjects.has(drawableObject)) {
                    updatedObjects.add(drawableObject)
                    drawableObject.update(delta)
                }

                if(particle.isNeedRecreate && !this.isOneShoot && this.isPlaying) {
                    this.recreateParticle(particle)
                }
            }

            particle.update(delta)
        }
    }
}